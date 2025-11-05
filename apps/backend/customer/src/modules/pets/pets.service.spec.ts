import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { CreatePetRequestBody, UpdatePetRequestBody } from "customer_api";

import { PetsRepository } from "./pets.repository";
import { PetsService } from "./pets.service";

describe("PetsService", () => {
  let service: PetsService;
  let repository: jest.Mocked<PetsRepository>;

  // Mock factory for PetsRepository
  const mockPetsRepository = {
    createPet: jest.fn(),
    listPets: jest.fn(),
    getPetById: jest.fn(),
    updatePet: jest.fn(),
    deletePet: jest.fn(),
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PetsService,
        {
          provide: PetsRepository,
          useValue: mockPetsRepository,
        },
      ],
    }).compile();

    service = module.get<PetsService>(PetsService);
    repository = module.get(PetsRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("createPet", () => {
    it("should successfully create a pet", async () => {
      // Arrange
      const createPetData: CreatePetRequestBody = {
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: "Very friendly",
      };

      const expectedPet = {
        id: "pet-123",
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: "Very friendly",
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.createPet.mockResolvedValue(expectedPet as any);

      // Act
      const result = await service.createPet(createPetData);

      // Assert
      expect(repository.createPet).toHaveBeenCalledWith(createPetData);
      expect(repository.createPet).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedPet);
    });

    it("should create a pet with minimal required fields", async () => {
      // Arrange
      const minimalPetData: CreatePetRequestBody = {
        name: "Fluffy",
        species: "cat",
        pet_status: "has_owner",
        customer_id: "customer-456",
      };

      const expectedPet = {
        id: "pet-456",
        name: "Fluffy",
        species: "cat",
        pet_status: "has_owner",
        customer_id: "customer-456",
        birth_date: null,
        size: null,
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.createPet.mockResolvedValue(expectedPet as any);

      // Act
      const result = await service.createPet(minimalPetData);

      // Assert
      expect(repository.createPet).toHaveBeenCalledWith(minimalPetData);
      expect(result).toEqual(expectedPet);
    });

    it("should propagate errors from repository", async () => {
      // Arrange
      const createPetData: CreatePetRequestBody = {
        name: "Max",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-789",
      };

      const error = new Error("Database error");
      mockPetsRepository.createPet.mockRejectedValue(error);

      // Act & Assert
      await expect(service.createPet(createPetData)).rejects.toThrow(
        "Database error",
      );
      expect(repository.createPet).toHaveBeenCalledWith(createPetData);
    });
  });

  describe("listPets", () => {
    it("should list all pets without filters", async () => {
      // Arrange
      const expectedResult = {
        pets: [
          {
            id: "pet-1",
            name: "Buddy",
            species: "dog",
            pet_status: "adopting",
            customer_id: "customer-1",
            birth_date: "2020-01-01",
            size: "medium",
            notes: null,
            pet_image_url: null,
            pet_extra_information_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            id: "pet-2",
            name: "Fluffy",
            species: "cat",
            pet_status: "has_owner",
            customer_id: "customer-2",
            birth_date: "2019-05-15",
            size: "small",
            notes: null,
            pet_image_url: null,
            pet_extra_information_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 2,
      };

      mockPetsRepository.listPets.mockResolvedValue(expectedResult as any);

      // Act
      const result = await service.listPets({});

      // Assert
      expect(repository.listPets).toHaveBeenCalledWith({});
      expect(repository.listPets).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResult);
      expect(result.pets).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it("should list pets filtered by customer_id", async () => {
      // Arrange
      const filters = { customer_id: "customer-123" };
      const expectedResult = {
        pets: [
          {
            id: "pet-1",
            name: "Buddy",
            species: "dog",
            pet_status: "adopting",
            customer_id: "customer-123",
            birth_date: "2020-01-01",
            size: "medium",
            notes: null,
            pet_image_url: null,
            pet_extra_information_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 1,
      };

      mockPetsRepository.listPets.mockResolvedValue(expectedResult as any);

      // Act
      const result = await service.listPets(filters);

      // Assert
      expect(repository.listPets).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResult);
      expect(result.pets).toHaveLength(1);
      expect(result.pets[0].customer_id).toBe("customer-123");
    });

    it("should list pets filtered by species", async () => {
      // Arrange
      const filters = { species: "dog" };
      const expectedResult = {
        pets: [
          {
            id: "pet-1",
            name: "Buddy",
            species: "dog",
            pet_status: "adopting",
            customer_id: "customer-123",
            birth_date: "2020-01-01",
            size: "medium",
            notes: null,
            pet_image_url: null,
            pet_extra_information_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 1,
      };

      mockPetsRepository.listPets.mockResolvedValue(expectedResult as any);

      // Act
      const result = await service.listPets(filters);

      // Assert
      expect(repository.listPets).toHaveBeenCalledWith(filters);
      expect(result.pets[0].species).toBe("dog");
    });

    it("should list pets with pagination", async () => {
      // Arrange
      const filters = { limit: 10, offset: 20 };
      const expectedResult = {
        pets: [],
        total: 100,
      };

      mockPetsRepository.listPets.mockResolvedValue(expectedResult);

      // Act
      const result = await service.listPets(filters);

      // Assert
      expect(repository.listPets).toHaveBeenCalledWith(filters);
      expect(result.total).toBe(100);
    });

    it("should return empty list when no pets found", async () => {
      // Arrange
      const expectedResult = {
        pets: [],
        total: 0,
      };

      mockPetsRepository.listPets.mockResolvedValue(expectedResult);

      // Act
      const result = await service.listPets({});

      // Assert
      expect(repository.listPets).toHaveBeenCalledWith({});
      expect(result.pets).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it("should handle multiple filters combined", async () => {
      // Arrange
      const filters = {
        customer_id: "customer-123",
        species: "dog",
        pet_status: "adopting",
        limit: 5,
        offset: 0,
      };
      const expectedResult = {
        pets: [
          {
            id: "pet-1",
            name: "Buddy",
            species: "dog",
            pet_status: "adopting",
            customer_id: "customer-123",
            birth_date: "2020-01-01",
            size: "medium",
            notes: null,
            pet_image_url: null,
            pet_extra_information_id: null,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        total: 1,
      };

      mockPetsRepository.listPets.mockResolvedValue(expectedResult as any);

      // Act
      const result = await service.listPets(filters);

      // Assert
      expect(repository.listPets).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getPetById", () => {
    it("should return a pet when found", async () => {
      // Arrange
      const petId = "pet-123";
      const expectedPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(expectedPet as any);

      // Act
      const result = await service.getPetById(petId);

      // Assert
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.getPetById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedPet);
    });

    it("should throw NotFoundException when pet not found", async () => {
      // Arrange
      const petId = "non-existent-pet";
      mockPetsRepository.getPetById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getPetById(petId)).rejects.toThrow(
        new NotFoundException(`Pet with ID ${petId} not found`),
      );
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
    });

    it("should propagate repository errors", async () => {
      // Arrange
      const petId = "pet-123";
      const error = new Error("Database connection error");
      mockPetsRepository.getPetById.mockRejectedValue(error);

      // Act & Assert
      await expect(service.getPetById(petId)).rejects.toThrow(
        "Database connection error",
      );
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
    });
  });

  describe("updatePet", () => {
    it("should successfully update a pet", async () => {
      // Arrange
      const petId = "pet-123";
      const updateData: UpdatePetRequestBody = {
        name: "Buddy Updated",
        notes: "Very friendly and energetic",
      };

      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedPet = {
        ...existingPet,
        name: "Buddy Updated",
        notes: "Very friendly and energetic",
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.updatePet.mockResolvedValue(updatedPet as any);

      // Act
      const result = await service.updatePet(petId, updateData);

      // Assert
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.updatePet).toHaveBeenCalledWith(petId, updateData);
      expect(result).toEqual(updatedPet);
      expect(result.name).toBe("Buddy Updated");
      expect(result.notes).toBe("Very friendly and energetic");
    });

    it("should throw NotFoundException when pet to update does not exist", async () => {
      // Arrange
      const petId = "non-existent-pet";
      const updateData: UpdatePetRequestBody = {
        name: "New Name",
      };

      mockPetsRepository.getPetById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updatePet(petId, updateData)).rejects.toThrow(
        new NotFoundException(`Pet with ID ${petId} not found`),
      );
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.updatePet).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException when update returns null", async () => {
      // Arrange
      const petId = "pet-123";
      const updateData: UpdatePetRequestBody = {
        name: "New Name",
      };

      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.updatePet.mockResolvedValue(null);

      // Act & Assert
      await expect(service.updatePet(petId, updateData)).rejects.toThrow(
        new NotFoundException(`Pet with ID ${petId} not found`),
      );
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.updatePet).toHaveBeenCalledWith(petId, updateData);
    });

    it("should update pet status", async () => {
      // Arrange
      const petId = "pet-123";
      const updateData: UpdatePetRequestBody = {
        pet_status: "has_owner",
      };

      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedPet = {
        ...existingPet,
        pet_status: "has_owner",
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.updatePet.mockResolvedValue(updatedPet as any);

      // Act
      const result = await service.updatePet(petId, updateData);

      // Assert
      expect(repository.updatePet).toHaveBeenCalledWith(petId, updateData);
      expect(result.pet_status).toBe("has_owner");
    });

    it("should handle partial updates", async () => {
      // Arrange
      const petId = "pet-123";
      const updateData: UpdatePetRequestBody = {
        pet_image_url: "https://example.com/new-image.jpg",
      };

      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const updatedPet = {
        ...existingPet,
        pet_image_url: "https://example.com/new-image.jpg",
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.updatePet.mockResolvedValue(updatedPet as any);

      // Act
      const result = await service.updatePet(petId, updateData);

      // Assert
      expect(repository.updatePet).toHaveBeenCalledWith(petId, updateData);
      expect(result.pet_image_url).toBe("https://example.com/new-image.jpg");
      expect(result.name).toBe("Buddy"); // Other fields unchanged
    });
  });

  describe("deletePet", () => {
    it("should successfully delete a pet", async () => {
      // Arrange
      const petId = "pet-123";
      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.deletePet.mockResolvedValue(existingPet as any);

      // Act
      const result = await service.deletePet(petId);

      // Assert
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.deletePet).toHaveBeenCalledWith(petId);
      expect(repository.deletePet).toHaveBeenCalledTimes(1);
      expect(result).toEqual(existingPet);
    });

    it("should throw NotFoundException when pet to delete does not exist", async () => {
      // Arrange
      const petId = "non-existent-pet";
      mockPetsRepository.getPetById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deletePet(petId)).rejects.toThrow(
        new NotFoundException(`Pet with ID ${petId} not found`),
      );
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.deletePet).not.toHaveBeenCalled();
    });

    it("should throw NotFoundException when delete returns null", async () => {
      // Arrange
      const petId = "pet-123";
      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.deletePet.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deletePet(petId)).rejects.toThrow(
        new NotFoundException(`Pet with ID ${petId} not found`),
      );
      expect(repository.getPetById).toHaveBeenCalledWith(petId);
      expect(repository.deletePet).toHaveBeenCalledWith(petId);
    });

    it("should propagate repository errors", async () => {
      // Arrange
      const petId = "pet-123";
      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const error = new Error("Foreign key constraint violation");
      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.deletePet.mockRejectedValue(error);

      // Act & Assert
      await expect(service.deletePet(petId)).rejects.toThrow(
        "Foreign key constraint violation",
      );
      expect(repository.deletePet).toHaveBeenCalledWith(petId);
    });
  });

  describe("Edge cases and integration scenarios", () => {
    it("should handle concurrent update and delete operations", async () => {
      // Arrange
      const petId = "pet-123";
      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      // First call returns pet, second call returns null (deleted)
      mockPetsRepository.getPetById
        .mockResolvedValueOnce(existingPet as any)
        .mockResolvedValueOnce(null);
      mockPetsRepository.updatePet.mockResolvedValue(null);

      const updateData: UpdatePetRequestBody = { name: "New Name" };

      // Act & Assert - update should fail because delete happened
      await expect(service.updatePet(petId, updateData)).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should handle empty update data", async () => {
      // Arrange
      const petId = "pet-123";
      const updateData: UpdatePetRequestBody = {};
      const existingPet = {
        id: petId,
        name: "Buddy",
        species: "dog",
        pet_status: "adopting",
        customer_id: "customer-123",
        birth_date: "2020-01-01",
        size: "medium",
        notes: null,
        pet_image_url: null,
        pet_extra_information_id: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockPetsRepository.getPetById.mockResolvedValue(existingPet as any);
      mockPetsRepository.updatePet.mockResolvedValue(existingPet as any);

      // Act
      const result = await service.updatePet(petId, updateData);

      // Assert - should still call update with empty object
      expect(repository.updatePet).toHaveBeenCalledWith(petId, {});
      expect(result).toEqual(existingPet);
    });
  });
});
