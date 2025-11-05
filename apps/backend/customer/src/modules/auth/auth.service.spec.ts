import { BadRequestException, ConflictException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import bcrypt from "bcryptjs";
import { Queue } from "bullmq";
import {
  CreateCustomerProfileRequestBody,
  RegisterGoogleRequestBody,
  RegisterWithEmailRequestBody,
  VerifyAccountRequestBody,
} from "customer_api";

import {
  EMAIL_PROCESS_NAMES,
  QUEUE_PROCESSOR_NAMES,
} from "@/common/constants/queue.constants";
import * as generateJWTUtil from "@/common/utils";
import { CustomerRepository } from "@/modules/customer/customer.repository";

import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";

// Mock bcryptjs
jest.mock("bcryptjs");

// Mock the generateJWT utility
jest.mock("@/common/utils", () => ({
  generateJWT: jest.fn(),
}));

describe("AuthService", () => {
  let service: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let emailQueue: jest.Mocked<Queue>;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;

  // Mock factory for AuthRepository
  const mockAuthRepository = {
    createCustomerWithGoogle: jest.fn(),
    getAccountByEmail: jest.fn(),
    createCustomerAccountByCredential: jest.fn(),
    getAccountById: jest.fn(),
    updateCustomerAccount: jest.fn(),
    createCustomerProfileAndAssignToAccount: jest.fn(),
  };

  // Mock factory for CustomerRepository
  const mockCustomerRepository = {
    getCustomerProfileByAccountId: jest.fn(),
    getCustomerProfileById: jest.fn(),
    createCustomerProfile: jest.fn(),
  };

  // Mock factory for BullMQ Queue
  const mockEmailQueue = {
    add: jest.fn(),
    close: jest.fn(),
    getJobCounts: jest.fn(),
    getJobs: jest.fn(),
  };

  // Mock factory for JwtService
  const mockJwtService = {
    verifyAsync: jest.fn(),
    sign: jest.fn(),
    decode: jest.fn(),
  };

  // Mock factory for ConfigService
  const mockConfigService = {
    get: jest.fn(),
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: CustomerRepository,
          useValue: mockCustomerRepository,
        },
        {
          provide: `BullQueue_${QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR}`,
          useValue: mockEmailQueue,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    authRepository = module.get(AuthRepository);
    customerRepository = module.get(CustomerRepository);
    emailQueue = module.get(`BullQueue_${QUEUE_PROCESSOR_NAMES.EMAIL_PROCESSOR}`);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("registerGoogle", () => {
    it("should successfully register a customer with Google", async () => {
      // Arrange
      const googleRegisterData: RegisterGoogleRequestBody = {
        email: "test@gmail.com",
        given_name: "John",
        family_name: "Doe",
        picture: "https://example.com/picture.jpg",
      };

      const expectedCustomer = {
        id: "customer-123",
        first_name: "John",
        last_name: "Doe",
        address: null,
        profile_image_url: "https://example.com/picture.jpg",
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockAuthRepository.createCustomerWithGoogle.mockResolvedValue(
        expectedCustomer,
      );

      // Act
      const result = await service.registerGoogle(googleRegisterData);

      // Assert
      expect(authRepository.createCustomerWithGoogle).toHaveBeenCalledWith(
        googleRegisterData,
      );
      expect(authRepository.createCustomerWithGoogle).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedCustomer);
    });

    it("should propagate errors from repository", async () => {
      // Arrange
      const googleRegisterData: RegisterGoogleRequestBody = {
        email: "test@gmail.com",
        given_name: "John",
        family_name: "Doe",
        picture: "https://example.com/picture.jpg",
      };

      const error = new Error("Database error");
      mockAuthRepository.createCustomerWithGoogle.mockRejectedValue(error);

      // Act & Assert
      await expect(service.registerGoogle(googleRegisterData)).rejects.toThrow(
        "Database error",
      );
      expect(authRepository.createCustomerWithGoogle).toHaveBeenCalledWith(
        googleRegisterData,
      );
    });
  });

  describe("registerCredentials", () => {
    const registerData: RegisterWithEmailRequestBody = {
      email: "test@example.com",
    };

    it("should successfully register a new customer with email", async () => {
      // Arrange
      const newAccountId = "account-123";
      const mockToken = "verification-token-123";

      mockAuthRepository.getAccountByEmail.mockResolvedValue(null);
      mockAuthRepository.createCustomerAccountByCredential.mockResolvedValue(
        newAccountId,
      );
      mockConfigService.get
        .mockReturnValueOnce("1d") // jwt.expiresIn.emailVerification
        .mockReturnValueOnce("email-verification-secret"); // jwt.secret.emailVerification
      (generateJWTUtil.generateJWT as jest.Mock).mockResolvedValue(mockToken);
      mockEmailQueue.add.mockResolvedValue({} as any);

      // Act
      await service.registerCredentials(registerData);

      // Assert
      expect(authRepository.getAccountByEmail).toHaveBeenCalledWith(
        registerData.email,
      );
      expect(
        authRepository.createCustomerAccountByCredential,
      ).toHaveBeenCalledWith(registerData);
      expect(generateJWTUtil.generateJWT).toHaveBeenCalledWith({
        expirationTime: "1d",
        payload: {
          sub: newAccountId,
          user: null,
        },
        secret: "email-verification-secret",
      });
      expect(emailQueue.add).toHaveBeenCalledWith(
        EMAIL_PROCESS_NAMES.REGISTER_VERIFICATION_EMAIL_TO_CUSTOMER_PROCESS,
        {
          email: registerData.email,
          context: {
            token: mockToken,
          },
        },
      );
    });

    it("should throw BadRequestException if account is inactive", async () => {
      // Arrange
      mockAuthRepository.getAccountByEmail.mockResolvedValue({
        id: "account-123",
        email: registerData.email,
        status: "inactive",
        hash: "hash",
        customer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act & Assert
      await expect(service.registerCredentials(registerData)).rejects.toThrow(
        new BadRequestException("ACCOUNT_IS_INACTIVE"),
      );
      expect(authRepository.getAccountByEmail).toHaveBeenCalledWith(
        registerData.email,
      );
      expect(
        authRepository.createCustomerAccountByCredential,
      ).not.toHaveBeenCalled();
      expect(emailQueue.add).not.toHaveBeenCalled();
    });

    it("should throw ConflictException if account is already active", async () => {
      // Arrange
      mockAuthRepository.getAccountByEmail.mockResolvedValue({
        id: "account-123",
        email: registerData.email,
        status: "active",
        hash: "hash",
        customer_id: "customer-123",
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act & Assert
      await expect(service.registerCredentials(registerData)).rejects.toThrow(
        new ConflictException("ACCOUNT_ALREADY_EXISTS"),
      );
      expect(authRepository.getAccountByEmail).toHaveBeenCalledWith(
        registerData.email,
      );
      expect(
        authRepository.createCustomerAccountByCredential,
      ).not.toHaveBeenCalled();
      expect(emailQueue.add).not.toHaveBeenCalled();
    });

    it("should resend verification email if account is pending", async () => {
      // Arrange
      const existingAccountId = "account-123";
      const mockToken = "verification-token-456";

      mockAuthRepository.getAccountByEmail.mockResolvedValue({
        id: existingAccountId,
        email: registerData.email,
        status: "pending",
        hash: "hash",
        customer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });
      mockConfigService.get
        .mockReturnValueOnce("1d")
        .mockReturnValueOnce("email-verification-secret");
      (generateJWTUtil.generateJWT as jest.Mock).mockResolvedValue(mockToken);
      mockEmailQueue.add.mockResolvedValue({} as any);

      // Act
      await service.registerCredentials(registerData);

      // Assert
      expect(authRepository.getAccountByEmail).toHaveBeenCalledWith(
        registerData.email,
      );
      expect(
        authRepository.createCustomerAccountByCredential,
      ).not.toHaveBeenCalled();
      expect(generateJWTUtil.generateJWT).toHaveBeenCalledWith({
        expirationTime: "1d",
        payload: {
          sub: existingAccountId,
          user: null,
        },
        secret: "email-verification-secret",
      });
      expect(emailQueue.add).toHaveBeenCalledWith(
        EMAIL_PROCESS_NAMES.REGISTER_VERIFICATION_EMAIL_TO_CUSTOMER_PROCESS,
        {
          email: registerData.email,
          context: {
            token: mockToken,
          },
        },
      );
    });

    it("should handle email queue errors gracefully", async () => {
      // Arrange
      const newAccountId = "account-123";
      const mockToken = "verification-token-123";
      const queueError = new Error("Queue connection failed");

      mockAuthRepository.getAccountByEmail.mockResolvedValue(null);
      mockAuthRepository.createCustomerAccountByCredential.mockResolvedValue(
        newAccountId,
      );
      mockConfigService.get
        .mockReturnValueOnce("1d")
        .mockReturnValueOnce("email-verification-secret");
      (generateJWTUtil.generateJWT as jest.Mock).mockResolvedValue(mockToken);
      mockEmailQueue.add.mockRejectedValue(queueError);

      // Act & Assert
      await expect(service.registerCredentials(registerData)).rejects.toThrow(
        "Queue connection failed",
      );
    });
  });

  describe("createCustomerProfile", () => {
    const accountId = "account-123";
    const profileData: CreateCustomerProfileRequestBody = {
      first_name: "John",
      last_name: "Doe",
      nickname: "johnny",
      address: "123 Main St",
      phone: "+1234567890",
      profile_image_url: "https://example.com/profile.jpg",
      gender: "male",
      zip_code: "12345",
    };

    it("should successfully create a customer profile", async () => {
      // Arrange
      mockCustomerRepository.getCustomerProfileByAccountId.mockResolvedValue(
        null,
      );
      mockAuthRepository.createCustomerProfileAndAssignToAccount.mockResolvedValue(
        undefined,
      );

      // Act
      await service.createCustomerProfile(accountId, profileData);

      // Assert
      expect(
        customerRepository.getCustomerProfileByAccountId,
      ).toHaveBeenCalledWith(accountId);
      expect(
        authRepository.createCustomerProfileAndAssignToAccount,
      ).toHaveBeenCalledWith(accountId, profileData);
    });

    it("should throw BadRequestException if profile already exists", async () => {
      // Arrange
      mockCustomerRepository.getCustomerProfileByAccountId.mockResolvedValue({
        id: "profile-123",
        first_name: "Existing",
        last_name: "User",
        nickname: null,
        address: "Old Address",
        phone: null,
        profile_image_url: null,
        gender: null,
        zip_code: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Act & Assert
      await expect(
        service.createCustomerProfile(accountId, profileData),
      ).rejects.toThrow(new BadRequestException("PROFILE_ALREADY_EXISTS"));
      expect(
        customerRepository.getCustomerProfileByAccountId,
      ).toHaveBeenCalledWith(accountId);
      expect(
        authRepository.createCustomerProfileAndAssignToAccount,
      ).not.toHaveBeenCalled();
    });

    it("should propagate repository errors", async () => {
      // Arrange
      const error = new Error("Database transaction failed");
      mockCustomerRepository.getCustomerProfileByAccountId.mockResolvedValue(
        null,
      );
      mockAuthRepository.createCustomerProfileAndAssignToAccount.mockRejectedValue(
        error,
      );

      // Act & Assert
      await expect(
        service.createCustomerProfile(accountId, profileData),
      ).rejects.toThrow("Database transaction failed");
      expect(
        customerRepository.getCustomerProfileByAccountId,
      ).toHaveBeenCalledWith(accountId);
      expect(
        authRepository.createCustomerProfileAndAssignToAccount,
      ).toHaveBeenCalledWith(accountId, profileData);
    });
  });

  describe("verifyAccount", () => {
    const verifyData: VerifyAccountRequestBody = {
      token: "valid-jwt-token",
      newPassword: "NewPassword123!",
    };

    const accountId = "account-123";
    const mockAccount = {
      id: accountId,
      email: "test@example.com",
      status: "pending" as const,
      hash: "old-hash",
      customer_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    beforeEach(() => {
      // Setup default config service mock for all verify tests
      mockConfigService.get.mockReturnValue("email-verification-secret");
    });

    it("should successfully verify account and update password", async () => {
      // Arrange
      const salt = "generated-salt";
      const hashedPassword = "hashed-password";

      mockJwtService.verifyAsync.mockResolvedValue({ sub: accountId });
      mockAuthRepository.getAccountById.mockResolvedValue(mockAccount);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.updateCustomerAccount.mockResolvedValue(undefined);

      // Act
      await service.verifyAccount(verifyData);

      // Assert
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).toHaveBeenCalledWith(accountId);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(verifyData.newPassword, salt);
      expect(authRepository.updateCustomerAccount).toHaveBeenCalledWith(
        accountId,
        {
          status: "active",
          hash: hashedPassword,
        },
      );
    });

    it("should throw BadRequestException if token is invalid", async () => {
      // Arrange
      mockJwtService.verifyAsync.mockRejectedValue(new Error("Invalid token"));

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        new BadRequestException("INVALID_TOKEN"),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).not.toHaveBeenCalled();
      expect(authRepository.updateCustomerAccount).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException if token is expired", async () => {
      // Arrange
      const expiredError = new Error("Token expired");
      expiredError.name = "TokenExpiredError";
      mockJwtService.verifyAsync.mockRejectedValue(expiredError);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        new BadRequestException("INVALID_TOKEN"),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException if account does not exist", async () => {
      // Arrange
      mockJwtService.verifyAsync.mockResolvedValue({ sub: accountId });
      mockAuthRepository.getAccountById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        new BadRequestException("INVALID_TOKEN"),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).toHaveBeenCalledWith(accountId);
      expect(authRepository.updateCustomerAccount).not.toHaveBeenCalled();
    });

    it("should throw BadRequestException if account does not exist (undefined)", async () => {
      // Arrange
      mockJwtService.verifyAsync.mockResolvedValue({ sub: accountId });
      mockAuthRepository.getAccountById.mockResolvedValue(undefined as any);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        new BadRequestException("INVALID_TOKEN"),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).toHaveBeenCalledWith(accountId);
      expect(authRepository.updateCustomerAccount).not.toHaveBeenCalled();
    });

    it("should handle bcrypt errors gracefully", async () => {
      // Arrange
      const bcryptError = new Error("Hashing failed");
      mockJwtService.verifyAsync.mockResolvedValue({ sub: accountId });
      mockAuthRepository.getAccountById.mockResolvedValue(mockAccount);
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(bcryptError);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        "Hashing failed",
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).toHaveBeenCalledWith(accountId);
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(authRepository.updateCustomerAccount).not.toHaveBeenCalled();
    });

    it("should handle database update errors", async () => {
      // Arrange
      const salt = "generated-salt";
      const hashedPassword = "hashed-password";
      const dbError = new Error("Database update failed");

      mockJwtService.verifyAsync.mockResolvedValue({ sub: accountId });
      mockAuthRepository.getAccountById.mockResolvedValue(mockAccount);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue(salt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.updateCustomerAccount.mockRejectedValue(dbError);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        "Database update failed",
      );
      expect(authRepository.updateCustomerAccount).toHaveBeenCalledWith(
        accountId,
        {
          status: "active",
          hash: hashedPassword,
        },
      );
    });

    it("should handle JWT verification returning null payload", async () => {
      // Arrange
      mockJwtService.verifyAsync.mockResolvedValue(null as any);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        new BadRequestException("INVALID_TOKEN"),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      expect(authRepository.getAccountById).not.toHaveBeenCalled();
    });

    it("should handle JWT verification returning payload without sub", async () => {
      // Arrange
      mockJwtService.verifyAsync.mockResolvedValue({} as any);

      // Act & Assert
      await expect(service.verifyAccount(verifyData)).rejects.toThrow(
        new BadRequestException("INVALID_TOKEN"),
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(verifyData.token, {
        secret: "email-verification-secret",
      });
      // Should still try to get account with undefined sub
      expect(authRepository.getAccountById).toHaveBeenCalledWith(undefined);
    });
  });

  describe("sendVerificationEmail (private method)", () => {
    it("should send verification email when account is created", async () => {
      // This test verifies the private method is called correctly through registerCredentials
      // Arrange
      const registerData: RegisterWithEmailRequestBody = {
        email: "test@example.com",
      };
      const newAccountId = "account-123";
      const mockToken = "verification-token-123";

      mockAuthRepository.getAccountByEmail.mockResolvedValue(null);
      mockAuthRepository.createCustomerAccountByCredential.mockResolvedValue(
        newAccountId,
      );
      mockConfigService.get
        .mockReturnValueOnce("1d")
        .mockReturnValueOnce("email-verification-secret");
      (generateJWTUtil.generateJWT as jest.Mock).mockResolvedValue(mockToken);
      mockEmailQueue.add.mockResolvedValue({} as any);

      // Act
      await service.registerCredentials(registerData);

      // Assert - verify the email was sent with correct parameters
      expect(generateJWTUtil.generateJWT).toHaveBeenCalledWith({
        expirationTime: "1d",
        payload: {
          sub: newAccountId,
          user: null,
        },
        secret: "email-verification-secret",
      });
      expect(emailQueue.add).toHaveBeenCalledWith(
        EMAIL_PROCESS_NAMES.REGISTER_VERIFICATION_EMAIL_TO_CUSTOMER_PROCESS,
        {
          email: registerData.email,
          context: {
            token: mockToken,
          },
        },
      );
    });

    it("should use correct config values for JWT generation", async () => {
      // Arrange
      const registerData: RegisterWithEmailRequestBody = {
        email: "test@example.com",
      };
      const newAccountId = "account-456";
      const customExpiresIn = "2h";
      const customSecret = "custom-secret-key";

      mockAuthRepository.getAccountByEmail.mockResolvedValue(null);
      mockAuthRepository.createCustomerAccountByCredential.mockResolvedValue(
        newAccountId,
      );
      mockConfigService.get
        .mockReturnValueOnce(customExpiresIn)
        .mockReturnValueOnce(customSecret);
      (generateJWTUtil.generateJWT as jest.Mock).mockResolvedValue("token");
      mockEmailQueue.add.mockResolvedValue({} as any);

      // Act
      await service.registerCredentials(registerData);

      // Assert
      expect(configService.get).toHaveBeenCalledWith(
        "jwt.expiresIn.emailVerification",
      );
      expect(configService.get).toHaveBeenCalledWith(
        "jwt.secret.emailVerification",
      );
      expect(generateJWTUtil.generateJWT).toHaveBeenCalledWith({
        expirationTime: customExpiresIn,
        payload: {
          sub: newAccountId,
          user: null,
        },
        secret: customSecret,
      });
    });
  });

  describe("Edge cases and integration scenarios", () => {
    it("should handle concurrent registration attempts for same email", async () => {
      // This tests the race condition where two requests try to register same email
      const registerData: RegisterWithEmailRequestBody = {
        email: "test@example.com",
      };

      // First call - no existing account
      mockAuthRepository.getAccountByEmail.mockResolvedValueOnce(null);
      // Second call - account now exists as pending
      mockAuthRepository.getAccountByEmail.mockResolvedValueOnce({
        id: "account-123",
        email: registerData.email,
        status: "pending",
        hash: "hash",
        customer_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

      mockAuthRepository.createCustomerAccountByCredential.mockResolvedValue(
        "account-123",
      );
      mockConfigService.get.mockReturnValue("secret");
      (generateJWTUtil.generateJWT as jest.Mock).mockResolvedValue("token");
      mockEmailQueue.add.mockResolvedValue({} as any);

      // Act - simulate two concurrent calls
      await service.registerCredentials(registerData);
      await service.registerCredentials(registerData);

      // Assert - both should complete without throwing
      expect(emailQueue.add).toHaveBeenCalledTimes(2);
    });

    it("should handle JWT generation errors", async () => {
      // Arrange
      const registerData: RegisterWithEmailRequestBody = {
        email: "test@example.com",
      };
      const jwtError = new Error("JWT generation failed");

      mockAuthRepository.getAccountByEmail.mockResolvedValue(null);
      mockAuthRepository.createCustomerAccountByCredential.mockResolvedValue(
        "account-123",
      );
      mockConfigService.get.mockReturnValue("secret");
      (generateJWTUtil.generateJWT as jest.Mock).mockRejectedValue(jwtError);

      // Act & Assert - should propagate the error from generateJWT
      await expect(service.registerCredentials(registerData)).rejects.toThrow(
        "JWT generation failed",
      );
    });
  });
});
