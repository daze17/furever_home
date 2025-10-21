import "dotenv/config";
import { db } from "./client";
import {
  customers,
  customer_accounts,
  customer_settings,
  pet_preferences,
  pets,
  pet_extra_informations,
  pet_medical_records,
  pet_images,
  adoption_posts,
  adoption_applications,
  adoption_transactions,
  adoption_reviews,
  messages,
  favorites,
} from "./schemas";

// Password: "password123" hashed with bcrypt
const HASHED_PASSWORD =
  "$2b$10$YourHashedPasswordHere.REPLACE.WITH.REAL.HASH";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Clean existing data (in reverse order of dependencies)
    console.log("🧹 Cleaning existing data...");
    await db.delete(messages);
    await db.delete(favorites);
    await db.delete(adoption_reviews);
    await db.delete(adoption_transactions);
    await db.delete(adoption_applications);
    await db.delete(adoption_posts);
    await db.delete(pet_images);
    await db.delete(pet_medical_records);
    await db.delete(pets);
    await db.delete(pet_extra_informations);
    await db.delete(pet_preferences);
    await db.delete(customer_settings);
    await db.delete(customer_accounts);
    await db.delete(customers);

    // 1. Create Customers
    console.log("👥 Creating customers...");
    const customersData = await db
      .insert(customers)
      .values([
        {
          first_name: "John",
          last_name: "Smith",
          nickname: "JohnnyS",
          address: "123 Main St, Seattle, WA",
          phone: "+1-206-555-0101",
          gender: "male",
          zip_code: "98101",
          profile_image_url: "https://i.pravatar.cc/150?img=12",
        },
        {
          first_name: "Sarah",
          last_name: "Johnson",
          nickname: "SarahJ",
          address: "456 Oak Ave, Portland, OR",
          phone: "+1-503-555-0202",
          gender: "female",
          zip_code: "97201",
          profile_image_url: "https://i.pravatar.cc/150?img=25",
        },
        {
          first_name: "Michael",
          last_name: "Chen",
          nickname: "MikeC",
          address: "789 Pine St, San Francisco, CA",
          phone: "+1-415-555-0303",
          gender: "male",
          zip_code: "94102",
          profile_image_url: "https://i.pravatar.cc/150?img=33",
        },
        {
          first_name: "Emily",
          last_name: "Rodriguez",
          nickname: "EmilyR",
          address: "321 Elm St, Los Angeles, CA",
          phone: "+1-213-555-0404",
          gender: "female",
          zip_code: "90001",
          profile_image_url: "https://i.pravatar.cc/150?img=45",
        },
        {
          first_name: "David",
          last_name: "Williams",
          nickname: "DaveW",
          address: "654 Maple Dr, Austin, TX",
          phone: "+1-512-555-0505",
          gender: "male",
          zip_code: "73301",
          profile_image_url: "https://i.pravatar.cc/150?img=51",
        },
      ])
      .returning();

    console.log(`✅ Created ${customersData.length} customers`);

    // 2. Create Customer Accounts
    console.log("🔐 Creating customer accounts...");
    const accountsData = await db
      .insert(customer_accounts)
      .values([
        {
          id: "john_smith_001",
          email: "john.smith@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customerId: customersData[0].id,
        },
        {
          id: "sarah_johnson_002",
          email: "sarah.johnson@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customerId: customersData[1].id,
        },
        {
          id: "michael_chen_003",
          email: "michael.chen@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customerId: customersData[2].id,
        },
        {
          id: "emily_rodriguez_004",
          email: "emily.rodriguez@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customerId: customersData[3].id,
        },
        {
          id: "david_williams_005",
          email: "david.williams@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customerId: customersData[4].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${accountsData.length} customer accounts`);

    // 3. Create Customer Settings
    console.log("⚙️  Creating customer settings...");
    await db.insert(customer_settings).values(
      customersData.map((customer) => ({
        customer_id: customer.id,
        receive_email_notification: true,
        receive_sms_notification: true,
      }))
    );

    console.log(`✅ Created ${customersData.length} customer settings`);

    // 4. Create Pet Preferences
    console.log("🐾 Creating pet preferences...");
    await db.insert(pet_preferences).values([
      {
        customer_id: customersData[0].id,
        preferred_species: ["dog"],
        preferred_size: ["medium", "large"],
        has_children: true,
        has_other_pets: false,
      },
      {
        customer_id: customersData[1].id,
        preferred_species: ["cat"],
        preferred_size: ["small", "medium"],
        has_children: false,
        has_other_pets: true,
      },
      {
        customer_id: customersData[2].id,
        preferred_species: ["dog", "cat"],
        preferred_size: ["small"],
        has_children: true,
        has_other_pets: true,
      },
      {
        customer_id: customersData[3].id,
        preferred_species: ["bird"],
        preferred_size: ["small"],
        has_children: false,
        has_other_pets: false,
      },
    ]);

    console.log("✅ Created 4 pet preferences");

    // 5. Create Pet Extra Informations
    console.log("📋 Creating pet extra information...");
    const petExtraInfos = await db
      .insert(pet_extra_informations)
      .values([
        {
          energy_level: "high",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "good",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "Senior cat, needs quiet environment",
          dietary_restrictions: "Low protein diet",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "fair",
          is_house_trained: true,
          training_level: "advanced",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "high",
          friendliness_with_children: "fair",
          friendliness_with_pets: "poor",
          is_house_trained: false,
          training_level: "none",
          special_needs: "Needs experienced owner",
          dietary_restrictions: "Grain-free diet required",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "good",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "Blind in one eye",
          dietary_restrictions: "None",
        },
      ])
      .returning();

    console.log(`✅ Created ${petExtraInfos.length} pet extra information records`);

    // 6. Create Pets
    console.log("🐕 Creating pets...");
    const petsData = await db
      .insert(pets)
      .values([
        {
          name: "Max",
          birth_date: "2020-03-15",
          species: "dog",
          notes: "Friendly golden retriever, loves to play fetch",
          pet_image_url: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1003.jpg",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[0].id,
          pet_extra_information_id: petExtraInfos[0].id,
        },
        {
          name: "Luna",
          birth_date: "2018-07-22",
          species: "cat",
          notes: "Calm and affectionate, perfect lap cat",
          pet_image_url: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[1].id,
          pet_extra_information_id: petExtraInfos[1].id,
        },
        {
          name: "Bella",
          birth_date: "2021-01-10",
          species: "dog",
          notes: "Well-trained beagle, great with kids",
          pet_image_url: "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[0].id,
          pet_extra_information_id: petExtraInfos[2].id,
        },
        {
          name: "Charlie",
          birth_date: "2022-05-18",
          species: "dog",
          notes: "Energetic husky puppy, needs active family",
          pet_image_url: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[2].id,
          pet_extra_information_id: petExtraInfos[3].id,
        },
        {
          name: "Whiskers",
          birth_date: "2019-11-30",
          species: "cat",
          notes: "Playful tabby cat, loves toys",
          pet_image_url: "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg",
          size: "medium",
          pet_status: "has_owner",
          customer_id: customersData[3].id,
          pet_extra_information_id: petExtraInfos[4].id,
        },
        {
          name: "Buddy",
          birth_date: "2017-09-12",
          species: "dog",
          notes: "Senior dog looking for a quiet home",
          pet_image_url: "https://images.dog.ceo/breeds/labrador/n02099712_3503.jpg",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[1].id,
          pet_extra_information_id: petExtraInfos[5].id,
        },
      ])
      .returning();

    console.log(`✅ Created ${petsData.length} pets`);

    // 7. Create Pet Medical Records
    console.log("💉 Creating pet medical records...");
    await db.insert(pet_medical_records).values([
      {
        pet_id: petsData[0].id,
        vaccination_name: "Rabies",
        vaccination_date: "2024-01-15",
        next_vaccination_date: "2025-01-15",
        is_spayed_neutered: true,
        medical_notes: "Healthy, all vaccinations up to date",
        allergies: "None",
      },
      {
        pet_id: petsData[1].id,
        vaccination_name: "FVRCP",
        vaccination_date: "2024-02-20",
        next_vaccination_date: "2025-02-20",
        is_spayed_neutered: true,
        medical_notes: "Senior wellness check completed",
        allergies: "Chicken",
      },
      {
        pet_id: petsData[2].id,
        vaccination_name: "DHPP",
        vaccination_date: "2024-03-10",
        next_vaccination_date: "2025-03-10",
        is_spayed_neutered: true,
        medical_notes: "All vaccinations current",
        allergies: "None",
      },
      {
        pet_id: petsData[3].id,
        vaccination_name: "Rabies",
        vaccination_date: "2024-06-01",
        next_vaccination_date: "2025-06-01",
        is_spayed_neutered: false,
        medical_notes: "Scheduled for neutering next month",
        allergies: "Grain allergies",
      },
      {
        pet_id: petsData[4].id,
        vaccination_name: "FVRCP",
        vaccination_date: "2024-04-15",
        next_vaccination_date: "2025-04-15",
        is_spayed_neutered: true,
        medical_notes: "Healthy",
        allergies: "None",
      },
      {
        pet_id: petsData[5].id,
        vaccination_name: "DHPP",
        vaccination_date: "2023-12-20",
        next_vaccination_date: "2024-12-20",
        is_spayed_neutered: true,
        medical_notes: "Vision impairment in right eye, otherwise healthy",
        allergies: "None",
      },
    ]);

    console.log("✅ Created 6 pet medical records");

    // 8. Create Pet Images
    console.log("📸 Creating pet images...");
    await db.insert(pet_images).values([
      {
        pet_id: petsData[0].id,
        image_url: "https://images.dog.ceo/breeds/retriever-golden/n02099601_1003.jpg",
        is_primary: true,
        display_order: 1,
      },
      {
        pet_id: petsData[0].id,
        image_url: "https://images.dog.ceo/breeds/retriever-golden/n02099601_2209.jpg",
        is_primary: false,
        display_order: 2,
      },
      {
        pet_id: petsData[1].id,
        image_url: "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg",
        is_primary: true,
        display_order: 1,
      },
      {
        pet_id: petsData[2].id,
        image_url: "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg",
        is_primary: true,
        display_order: 1,
      },
      {
        pet_id: petsData[3].id,
        image_url: "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg",
        is_primary: true,
        display_order: 1,
      },
    ]);

    console.log("✅ Created 5 pet images");

    // 9. Create Adoption Posts
    console.log("📝 Creating adoption posts...");
    const adoptionPostsData = await db
      .insert(adoption_posts)
      .values([
        {
          pet_id: petsData[0].id,
          owner: customersData[0].id,
          price: 200,
          address: "123 Main St, Seattle, WA 98101",
          contact: "+1-206-555-0101",
          notes:
            "Max is a wonderful family dog. Great with kids and loves outdoor activities.",
          post_status: "active",
        },
        {
          pet_id: petsData[1].id,
          owner: customersData[1].id,
          price: 150,
          address: "456 Oak Ave, Portland, OR 97201",
          contact: "+1-503-555-0202",
          notes: "Luna is looking for a quiet home where she can relax.",
          post_status: "active",
        },
        {
          pet_id: petsData[2].id,
          owner: customersData[0].id,
          price: 250,
          address: "123 Main St, Seattle, WA 98101",
          contact: "+1-206-555-0101",
          notes: "Bella is fully trained and very obedient. Perfect first dog.",
          post_status: "active",
        },
        {
          pet_id: petsData[3].id,
          owner: customersData[2].id,
          price: 300,
          address: "789 Pine St, San Francisco, CA 94102",
          contact: "+1-415-555-0303",
          notes:
            "Charlie needs an active owner who can keep up with his energy!",
          post_status: "active",
        },
        {
          pet_id: petsData[5].id,
          owner: customersData[1].id,
          price: 100,
          address: "456 Oak Ave, Portland, OR 97201",
          contact: "+1-503-555-0202",
          notes:
            "Buddy is a sweet senior dog looking for a loving retirement home.",
          post_status: "active",
        },
      ])
      .returning();

    console.log(`✅ Created ${adoptionPostsData.length} adoption posts`);

    // 10. Create Adoption Applications
    console.log("📋 Creating adoption applications...");
    const applicationsData = await db
      .insert(adoption_applications)
      .values([
        {
          adoption_post_id: adoptionPostsData[0].id,
          applicant_id: customersData[2].id,
          message:
            "I have a large backyard and love to go hiking. Max would be perfect for my family!",
          application_status: "pending",
        },
        {
          adoption_post_id: adoptionPostsData[0].id,
          applicant_id: customersData[3].id,
          message: "I work from home and can give Max lots of attention.",
          application_status: "reviewing",
        },
        {
          adoption_post_id: adoptionPostsData[1].id,
          applicant_id: customersData[4].id,
          message:
            "I live alone in a quiet apartment. Luna sounds like the perfect companion.",
          application_status: "approved",
        },
        {
          adoption_post_id: adoptionPostsData[2].id,
          applicant_id: customersData[1].id,
          message: "My kids have been asking for a dog. Bella seems perfect!",
          application_status: "pending",
        },
        {
          adoption_post_id: adoptionPostsData[4].id,
          applicant_id: customersData[3].id,
          message:
            "I'm looking for a calm senior dog. I can provide a loving home for Buddy.",
          application_status: "approved",
        },
      ])
      .returning();

    console.log(`✅ Created ${applicationsData.length} adoption applications`);

    // 11. Create Adoption Transactions
    console.log("💰 Creating adoption transactions...");
    const transactionsData = await db
      .insert(adoption_transactions)
      .values([
        {
          adoption_post_id: adoptionPostsData[1].id,
          old_user_id: customersData[1].id,
          new_user_id: customersData[4].id,
          transaction_status: "completed",
        },
      ])
      .returning();

    console.log(`✅ Created ${transactionsData.length} adoption transactions`);

    // 12. Create Adoption Reviews
    console.log("⭐ Creating adoption reviews...");
    await db.insert(adoption_reviews).values([
      {
        adoption_transaction_id: transactionsData[0].id,
        reviewer_id: customersData[4].id,
        rating: 5,
        review_text:
          "Luna is absolutely perfect! The adoption process was smooth and Sarah was very helpful. Highly recommend!",
      },
    ]);

    console.log("✅ Created 1 adoption review");

    // 13. Create Messages
    console.log("💬 Creating messages...");
    await db.insert(messages).values([
      {
        adoption_application_id: applicationsData[0].id,
        sender_id: customersData[0].id,
        message_text:
          "Hi! Thanks for your interest in Max. Could you tell me more about your experience with dogs?",
        is_read: true,
      },
      {
        adoption_application_id: applicationsData[0].id,
        sender_id: customersData[2].id,
        message_text:
          "I've had dogs my whole life! Currently have a fenced yard and go on daily walks.",
        is_read: true,
      },
      {
        adoption_application_id: applicationsData[0].id,
        sender_id: customersData[0].id,
        message_text:
          "That sounds great! Would you be available for a meet and greet this weekend?",
        is_read: false,
      },
      {
        adoption_application_id: applicationsData[2].id,
        sender_id: customersData[1].id,
        message_text:
          "Your application has been approved! When would you like to pick up Luna?",
        is_read: true,
      },
      {
        adoption_application_id: applicationsData[2].id,
        sender_id: customersData[4].id,
        message_text: "That's wonderful! How about this Saturday afternoon?",
        is_read: true,
      },
    ]);

    console.log("✅ Created 5 messages");

    // 14. Create Favorites
    console.log("❤️  Creating favorites...");
    await db.insert(favorites).values([
      {
        customer_id: customersData[2].id,
        pet_id: petsData[0].id,
      },
      {
        customer_id: customersData[2].id,
        pet_id: petsData[2].id,
      },
      {
        customer_id: customersData[3].id,
        pet_id: petsData[0].id,
      },
      {
        customer_id: customersData[3].id,
        pet_id: petsData[5].id,
      },
      {
        customer_id: customersData[4].id,
        pet_id: petsData[1].id,
      },
    ]);

    console.log("✅ Created 5 favorites");

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${customersData.length} customers`);
    console.log(`   - ${accountsData.length} customer accounts`);
    console.log(`   - ${customersData.length} customer settings`);
    console.log("   - 4 pet preferences");
    console.log(`   - ${petExtraInfos.length} pet extra information records`);
    console.log(`   - ${petsData.length} pets`);
    console.log("   - 6 pet medical records");
    console.log("   - 5 pet images");
    console.log(`   - ${adoptionPostsData.length} adoption posts`);
    console.log(`   - ${applicationsData.length} adoption applications`);
    console.log(`   - ${transactionsData.length} adoption transactions`);
    console.log("   - 1 adoption review");
    console.log("   - 5 messages");
    console.log("   - 5 favorites");

    console.log("\n⚠️  NOTE: Update HASHED_PASSWORD constant with a real bcrypt hash for testing authentication");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
