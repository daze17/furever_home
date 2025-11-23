"use client";

import { Card, CardContent, CardHeader, CardTitle, Button } from "ui";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { PetForm } from "../components/pet_form";

export function NewPet() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pets
          </Link>
        </Button>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Create New Pet</CardTitle>
        </CardHeader>
        <CardContent>
          <PetForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
