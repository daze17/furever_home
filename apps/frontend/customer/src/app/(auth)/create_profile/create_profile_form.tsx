"use client";

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FormField,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "ui";

import { FormWithServerAction } from "@/components/form_with_server_action";

import { createProfileAction } from "./action";

const CreateProfileForm: React.FC = () => {
  return (
    <FormWithServerAction
      action={createProfileAction}
      render={({ state, status }) => {
        const { pending: isPending } = status;

        return (
          <div className="container mx-auto px-4 py-10">
            <Card className="mx-auto max-w-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  Create Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <FormField error={state?.data?.["firstName"]}>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="John"
                      />
                    </FormField>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <FormField error={state?.data?.["lastName"]}>
                      <Input id="lastName" name="lastName" placeholder="Doe" />
                    </FormField>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">Profile Image</Label>
                  {/* TODO: upload to s3 bucket */}
                  <FormField error={state?.data?.["profileImage"]}>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      value=""
                      type="hidden"
                      placeholder="Profile Image"
                    />
                  </FormField>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <FormField error={state?.data?.["about"]}>
                    <Textarea
                      id="about"
                      name="about"
                      placeholder="Tell us a little about yourself"
                      className="min-h-[100px]"
                    />
                  </FormField>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>

                  <FormField error={state?.data?.["address"]}>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main St, City, Country"
                    />
                  </FormField>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Birthdate</Label>
                    <FormField error={state?.data?.["birthdate"]}>
                      <Input id="birthdate" name="birthdate" type="date" />
                    </FormField>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>

                    <FormField error={state?.data?.["gender"]}>
                      <Select name="gender">
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormField>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <FormField error={state?.data?.["zipCode"]}>
                    <Input id="zipCode" name="zipCode" placeholder="12345" />
                  </FormField>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={isPending} className="w-full">
                  Create Profile
                </Button>
              </CardFooter>
            </Card>
          </div>
        );
      }}
    />
  );
};

export default CreateProfileForm;
