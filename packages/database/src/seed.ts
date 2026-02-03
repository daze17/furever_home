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
  vaccinations,
  pet_images,
  adoption_posts,
  adoption_applications,
  adoption_transactions,
  adoption_reviews,
  messages,
  favorites,
} from "./schemas";

// Password: "password123" hashed with bcryptjs
const HASHED_PASSWORD =
  "$2b$10$BuCMgDVXdh4Y86z9/Bfxa.m0B6LDOp9SJhoLY0VuM1dfXhN5e3ZG6";

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
    await db.delete(vaccinations);
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
          id: "email_john.smith@example.com",
          email: "john.smith@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customer_id: customersData[0]!.id,
        },
        {
          id: "email_sarah.johnson@example.com",
          email: "sarah.johnson@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customer_id: customersData[1]!.id,
        },
        {
          id: "email_michael.chen@example.com",
          email: "michael.chen@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customer_id: customersData[2]!.id,
        },
        {
          id: "email_emily.rodriguez@example.com",
          email: "emily.rodriguez@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customer_id: customersData[3]!.id,
        },
        {
          id: "email_david.williams@example.com",
          email: "david.williams@example.com",
          hash: HASHED_PASSWORD,
          status: "active",
          customer_id: customersData[4]!.id,
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
      })),
    );

    console.log(`✅ Created ${customersData.length} customer settings`);

    // 4. Create Pet Preferences
    console.log("🐾 Creating pet preferences...");
    await db.insert(pet_preferences).values([
      {
        customer_id: customersData[0]!.id,
        preferred_species: ["dog"],
        preferred_size: ["medium", "large"],
        has_children: true,
        has_other_pets: false,
      },
      {
        customer_id: customersData[1]!.id,
        preferred_species: ["cat"],
        preferred_size: ["small", "medium"],
        has_children: false,
        has_other_pets: true,
      },
      {
        customer_id: customersData[2]!.id,
        preferred_species: ["dog", "cat"],
        preferred_size: ["small"],
        has_children: true,
        has_other_pets: true,
      },
      {
        customer_id: customersData[3]!.id,
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
        // Original 6
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
        // New pets 7-30 extra info
        {
          energy_level: "high",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "advanced",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "good",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "Deaf, uses hand signals",
          dietary_restrictions: "None",
        },
        {
          energy_level: "high",
          friendliness_with_children: "good",
          friendliness_with_pets: "fair",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "None",
          dietary_restrictions: "Sensitive stomach",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "fair",
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
          training_level: "none",
          special_needs: "Senior pet",
          dietary_restrictions: "Low sodium diet",
        },
        {
          energy_level: "high",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "good",
          is_house_trained: false,
          training_level: "none",
          special_needs: "Puppy, needs training",
          dietary_restrictions: "None",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "advanced",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "fair",
          friendliness_with_pets: "poor",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "Prefers to be only pet",
          dietary_restrictions: "None",
        },
        {
          energy_level: "high",
          friendliness_with_children: "good",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "None",
          dietary_restrictions: "Grain-free",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "fair",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "good",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "Arthritis, needs soft bedding",
          dietary_restrictions: "Joint supplement required",
        },
        {
          energy_level: "high",
          friendliness_with_children: "fair",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "advanced",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "good",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "none",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "high",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "fair",
          is_house_trained: false,
          training_level: "none",
          special_needs: "Kitten, needs supervision",
          dietary_restrictions: "None",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "good",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "None",
          dietary_restrictions: "Hypoallergenic food",
        },
        {
          energy_level: "low",
          friendliness_with_children: "fair",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "Shy, needs patient owner",
          dietary_restrictions: "None",
        },
        {
          energy_level: "high",
          friendliness_with_children: "good",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "advanced",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "excellent",
          is_house_trained: true,
          training_level: "intermediate",
          special_needs: "None",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "good",
          friendliness_with_pets: "fair",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "Senior bird",
          dietary_restrictions: "Special seed mix",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "fair",
          friendliness_with_pets: "poor",
          is_house_trained: true,
          training_level: "none",
          special_needs: "Needs large tank",
          dietary_restrictions: "None",
        },
        {
          energy_level: "low",
          friendliness_with_children: "excellent",
          friendliness_with_pets: "good",
          is_house_trained: true,
          training_level: "basic",
          special_needs: "None",
          dietary_restrictions: "Timothy hay based diet",
        },
        {
          energy_level: "medium",
          friendliness_with_children: "good",
          friendliness_with_pets: "fair",
          is_house_trained: false,
          training_level: "none",
          special_needs: "Nocturnal",
          dietary_restrictions: "None",
        },
      ])
      .returning();

    console.log(
      `✅ Created ${petExtraInfos.length} pet extra information records`,
    );

    // Pet image URLs (stored separately since images are in pet_images table)
    const petImageUrls = [
      "https://images.dog.ceo/breeds/retriever-golden/n02099601_1003.jpg", // Max
      "https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg", // Luna
      "https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg", // Bella
      "https://images.dog.ceo/breeds/husky/n02110185_10047.jpg", // Charlie
      "https://cdn2.thecatapi.com/images/MTY3ODIyMQ.jpg", // Whiskers
      "https://images.dog.ceo/breeds/labrador/n02099712_3503.jpg", // Buddy
      "https://images.dog.ceo/breeds/germanshepherd/n02106662_1234.jpg", // Rocky
      "https://images.dog.ceo/breeds/boxer/n02108089_1234.jpg", // Duke
      "https://images.dog.ceo/breeds/dalmatian/cooper1.jpg", // Cooper
      "https://images.dog.ceo/breeds/corgi-cardigan/n02113186_1234.jpg", // Tucker
      "https://images.dog.ceo/breeds/chow/n02112137_1234.jpg", // Bear
      "https://images.dog.ceo/breeds/poodle-standard/n02113799_1234.jpg", // Milo
      "https://images.dog.ceo/breeds/bulldog-french/n02108915_1234.jpg", // Oscar
      "https://images.dog.ceo/breeds/collie-border/n02106166_1234.jpg", // Finn
      "https://images.dog.ceo/breeds/shiba/shiba-1.jpg", // Scout
      "https://images.dog.ceo/breeds/dane-great/n02109047_1234.jpg", // Zeus
      "https://cdn2.thecatapi.com/images/MTk1NTQ2OQ.jpg", // Shadow
      "https://cdn2.thecatapi.com/images/7iu.jpg", // Oliver
      "https://cdn2.thecatapi.com/images/OGTWqNNOt.jpg", // Simba
      "https://cdn2.thecatapi.com/images/ai6Jps4sx.jpg", // Cleo
      "https://cdn2.thecatapi.com/images/e3.jpg", // Mochi
      "https://cdn2.thecatapi.com/images/MjA3ODA2Nw.jpg", // Ginger
      "https://cdn2.thecatapi.com/images/j6oFGLpRG.jpg", // Smokey
      "https://cdn2.thecatapi.com/images/O3F3_S1XN.jpg", // Tiger
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Ara_ararauna_Luc_Viatour.jpg/220px-Ara_ararauna_Luc_Viatour.jpg", // Rio
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Cockatiel_crest.jpg/220px-Cockatiel_crest.jpg", // Kiwi
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Melopsittacus_undulatus_-facing_left-8a.jpg/220px-Melopsittacus_undulatus_-facing_left-8a.jpg", // Sunny
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Siamese_fighting_fish_-_Betta_splendens.jpg/220px-Siamese_fighting_fish_-_Betta_splendens.jpg", // Bubbles
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Amphiprion_ocellaris_%28Clown_anemonefish%29_in_Heteractis_magnifica_%28Sea_anemone%29.jpg/220px-Amphiprion_ocellaris_%28Clown_anemonefish%29_in_Heteractis_magnifica_%28Sea_anemone%29.jpg", // Nemo
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Oryctolagus_cuniculus_Rcdo.jpg/220px-Oryctolagus_cuniculus_Rcdo.jpg", // Thumper
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Pearl_Winter_White_Russian_Dwarf_Hamster_-_Front.jpg/220px-Pearl_Winter_White_Russian_Dwarf_Hamster_-_Front.jpg", // Peanut
    ];

    // 6. Create Pets
    console.log("🐕 Creating pets...");
    const petsData = await db
      .insert(pets)
      .values([
        // Original 6 pets
        {
          name: "Max",
          birth_date: "2020-03-15",
          species: "dog",
          notes: "Friendly golden retriever, loves to play fetch",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[0]!.id,
        },
        {
          name: "Luna",
          birth_date: "2018-07-22",
          species: "cat",
          notes: "Calm and affectionate, perfect lap cat",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[1]!.id,
        },
        {
          name: "Bella",
          birth_date: "2021-01-10",
          species: "dog",
          notes: "Well-trained beagle, great with kids",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[2]!.id,
        },
        {
          name: "Charlie",
          birth_date: "2022-05-18",
          species: "dog",
          notes: "Energetic husky puppy, needs active family",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[2]!.id,
          pet_extra_information_id: petExtraInfos[3]!.id,
        },
        {
          name: "Whiskers",
          birth_date: "2019-11-30",
          species: "cat",
          notes: "Playful tabby cat, loves toys",
          size: "medium",
          pet_status: "has_owner",
          customer_id: customersData[3]!.id,
          pet_extra_information_id: petExtraInfos[4]!.id,
        },
        {
          name: "Buddy",
          birth_date: "2017-09-12",
          species: "dog",
          notes: "Senior dog looking for a quiet home",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[5]!.id,
        },
        // New dogs (7-16)
        {
          name: "Rocky",
          birth_date: "2021-06-20",
          species: "dog",
          notes: "Loyal German Shepherd, excellent guard dog",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[6]!.id,
        },
        {
          name: "Duke",
          birth_date: "2019-02-14",
          species: "dog",
          notes: "Gentle boxer, loves cuddles and playtime",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[7]!.id,
        },
        {
          name: "Cooper",
          birth_date: "2016-08-05",
          species: "dog",
          notes: "Deaf dalmatian, trained with hand signals",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[2]!.id,
          pet_extra_information_id: petExtraInfos[8]!.id,
        },
        {
          name: "Tucker",
          birth_date: "2020-11-03",
          species: "dog",
          notes: "Playful corgi with a big personality",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[3]!.id,
          pet_extra_information_id: petExtraInfos[9]!.id,
        },
        {
          name: "Bear",
          birth_date: "2022-01-28",
          species: "dog",
          notes: "Fluffy chow chow, independent but loving",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[4]!.id,
          pet_extra_information_id: petExtraInfos[10]!.id,
        },
        {
          name: "Milo",
          birth_date: "2015-04-17",
          species: "dog",
          notes: "Sweet senior poodle, calm and well-mannered",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[11]!.id,
        },
        {
          name: "Oscar",
          birth_date: "2023-09-10",
          species: "dog",
          notes: "Adorable french bulldog puppy, needs training",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[12]!.id,
        },
        {
          name: "Finn",
          birth_date: "2020-07-22",
          species: "dog",
          notes: "Intelligent border collie, loves agility",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[2]!.id,
          pet_extra_information_id: petExtraInfos[13]!.id,
        },
        {
          name: "Scout",
          birth_date: "2018-12-01",
          species: "dog",
          notes: "Shy shiba inu, prefers to be the only pet",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[3]!.id,
          pet_extra_information_id: petExtraInfos[14]!.id,
        },
        {
          name: "Zeus",
          birth_date: "2021-03-08",
          species: "dog",
          notes: "Majestic great dane, gentle giant",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[4]!.id,
          pet_extra_information_id: petExtraInfos[15]!.id,
        },
        // New cats (17-24)
        {
          name: "Shadow",
          birth_date: "2019-05-15",
          species: "cat",
          notes: "Mysterious black cat, very affectionate once comfortable",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[16]!.id,
        },
        {
          name: "Oliver",
          birth_date: "2017-10-20",
          species: "cat",
          notes: "Senior orange tabby with arthritis, needs gentle care",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[17]!.id,
        },
        {
          name: "Simba",
          birth_date: "2021-08-30",
          species: "cat",
          notes: "Playful maine coon, loves to climb",
          size: "large",
          pet_status: "adopting",
          customer_id: customersData[2]!.id,
          pet_extra_information_id: petExtraInfos[18]!.id,
        },
        {
          name: "Cleo",
          birth_date: "2020-02-28",
          species: "cat",
          notes: "Elegant siamese, very vocal and social",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[3]!.id,
          pet_extra_information_id: petExtraInfos[19]!.id,
        },
        {
          name: "Mochi",
          birth_date: "2022-04-12",
          species: "cat",
          notes: "Fluffy persian, needs regular grooming",
          size: "medium",
          pet_status: "has_owner",
          customer_id: customersData[4]!.id,
          pet_extra_information_id: petExtraInfos[20]!.id,
        },
        {
          name: "Ginger",
          birth_date: "2023-06-15",
          species: "cat",
          notes: "Curious kitten, full of energy",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[21]!.id,
        },
        {
          name: "Smokey",
          birth_date: "2018-09-08",
          species: "cat",
          notes: "Russian blue, hypoallergenic and quiet",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[22]!.id,
        },
        {
          name: "Tiger",
          birth_date: "2019-01-25",
          species: "cat",
          notes: "Beautiful bengal, shy but sweet",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[2]!.id,
          pet_extra_information_id: petExtraInfos[23]!.id,
        },
        // Birds (25-27)
        {
          name: "Rio",
          birth_date: "2020-05-10",
          species: "bird",
          notes: "Colorful macaw, can say a few words",
          size: "medium",
          pet_status: "adopting",
          customer_id: customersData[3]!.id,
          pet_extra_information_id: petExtraInfos[24]!.id,
        },
        {
          name: "Kiwi",
          birth_date: "2021-11-20",
          species: "bird",
          notes: "Friendly cockatiel, loves to whistle",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[4]!.id,
          pet_extra_information_id: petExtraInfos[25]!.id,
        },
        {
          name: "Sunny",
          birth_date: "2016-03-15",
          species: "bird",
          notes: "Senior budgie, calm and gentle",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[0]!.id,
          pet_extra_information_id: petExtraInfos[26]!.id,
        },
        // Fish (28-29)
        {
          name: "Bubbles",
          birth_date: "2023-01-05",
          species: "fish",
          notes: "Beautiful betta fish, needs own tank",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[1]!.id,
          pet_extra_information_id: petExtraInfos[27]!.id,
        },
        {
          name: "Nemo",
          birth_date: "2022-08-22",
          species: "fish",
          notes: "Clownfish, needs saltwater aquarium",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[2]!.id,
          pet_extra_information_id: petExtraInfos[27]!.id,
        },
        // Other (30-31)
        {
          name: "Thumper",
          birth_date: "2022-03-18",
          species: "other",
          notes: "Friendly holland lop rabbit, litter trained",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[3]!.id,
          pet_extra_information_id: petExtraInfos[28]!.id,
        },
        {
          name: "Peanut",
          birth_date: "2023-05-01",
          species: "other",
          notes: "Cute syrian hamster, loves running on wheel",
          size: "small",
          pet_status: "adopting",
          customer_id: customersData[4]!.id,
          pet_extra_information_id: petExtraInfos[29]!.id,
        },
      ])
      .returning();

    console.log(`✅ Created ${petsData.length} pets`);

    // 7. Create Pet Medical Records
    console.log("💉 Creating pet medical records...");
    const medicalRecordsData = await db
      .insert(pet_medical_records)
      .values([
        // Original 6
        { pet_id: petsData[0]!.id, is_spayed_neutered: true, medical_notes: "Healthy, all vaccinations up to date", allergies: "None" },
        { pet_id: petsData[1]!.id, is_spayed_neutered: true, medical_notes: "Senior wellness check completed", allergies: "Chicken" },
        { pet_id: petsData[2]!.id, is_spayed_neutered: true, medical_notes: "All vaccinations current", allergies: "None" },
        { pet_id: petsData[3]!.id, is_spayed_neutered: false, medical_notes: "Scheduled for neutering next month", allergies: "Grain allergies" },
        { pet_id: petsData[4]!.id, is_spayed_neutered: true, medical_notes: "Healthy", allergies: "None" },
        { pet_id: petsData[5]!.id, is_spayed_neutered: true, medical_notes: "Vision impairment in right eye, otherwise healthy", allergies: "None" },
        // New dogs (6-15)
        { pet_id: petsData[6]!.id, is_spayed_neutered: true, medical_notes: "Healthy and active", allergies: "None" },
        { pet_id: petsData[7]!.id, is_spayed_neutered: true, medical_notes: "All vaccinations current", allergies: "None" },
        { pet_id: petsData[8]!.id, is_spayed_neutered: true, medical_notes: "Deaf, otherwise healthy", allergies: "None" },
        { pet_id: petsData[9]!.id, is_spayed_neutered: true, medical_notes: "Sensitive stomach, on special diet", allergies: "Beef" },
        { pet_id: petsData[10]!.id, is_spayed_neutered: true, medical_notes: "Healthy", allergies: "None" },
        { pet_id: petsData[11]!.id, is_spayed_neutered: true, medical_notes: "Senior check-up complete, low sodium diet", allergies: "None" },
        { pet_id: petsData[12]!.id, is_spayed_neutered: false, medical_notes: "Puppy, needs neutering", allergies: "None" },
        { pet_id: petsData[13]!.id, is_spayed_neutered: true, medical_notes: "Very healthy, high energy", allergies: "None" },
        { pet_id: petsData[14]!.id, is_spayed_neutered: true, medical_notes: "Healthy but anxious", allergies: "None" },
        { pet_id: petsData[15]!.id, is_spayed_neutered: true, medical_notes: "Large breed, joint supplements recommended", allergies: "Chicken" },
        // Cats (16-23)
        { pet_id: petsData[16]!.id, is_spayed_neutered: true, medical_notes: "Healthy", allergies: "None" },
        { pet_id: petsData[17]!.id, is_spayed_neutered: true, medical_notes: "Arthritis medication required", allergies: "None" },
        { pet_id: petsData[18]!.id, is_spayed_neutered: true, medical_notes: "Healthy, large breed", allergies: "None" },
        { pet_id: petsData[19]!.id, is_spayed_neutered: true, medical_notes: "Healthy and vocal", allergies: "None" },
        { pet_id: petsData[20]!.id, is_spayed_neutered: true, medical_notes: "Needs regular grooming", allergies: "None" },
        { pet_id: petsData[21]!.id, is_spayed_neutered: false, medical_notes: "Kitten, needs spaying", allergies: "None" },
        { pet_id: petsData[22]!.id, is_spayed_neutered: true, medical_notes: "Hypoallergenic, healthy", allergies: "Seafood" },
        { pet_id: petsData[23]!.id, is_spayed_neutered: true, medical_notes: "Healthy but shy", allergies: "None" },
        // Birds (24-26)
        { pet_id: petsData[24]!.id, is_spayed_neutered: false, medical_notes: "Healthy, wing clipped", allergies: "None" },
        { pet_id: petsData[25]!.id, is_spayed_neutered: false, medical_notes: "Healthy and active", allergies: "None" },
        { pet_id: petsData[26]!.id, is_spayed_neutered: false, medical_notes: "Senior bird, special seed mix", allergies: "None" },
        // Fish (27-28)
        { pet_id: petsData[27]!.id, is_spayed_neutered: false, medical_notes: "Healthy, needs warm water tank", allergies: "None" },
        { pet_id: petsData[28]!.id, is_spayed_neutered: false, medical_notes: "Healthy, requires saltwater setup", allergies: "None" },
        // Other (29-30)
        { pet_id: petsData[29]!.id, is_spayed_neutered: true, medical_notes: "Healthy rabbit, litter trained", allergies: "None" },
        { pet_id: petsData[30]!.id, is_spayed_neutered: false, medical_notes: "Healthy hamster", allergies: "None" },
      ])
      .returning();

    console.log(`✅ Created ${medicalRecordsData.length} pet medical records`);

    // 7b. Create Vaccinations
    console.log("💉 Creating vaccinations...");
    await db.insert(vaccinations).values([
      // Dogs - Rabies + DHPP
      { medical_record_id: medicalRecordsData[0]!.id, name: "Rabies", date: "2024-01-15", notes: "Annual booster" },
      { medical_record_id: medicalRecordsData[0]!.id, name: "DHPP", date: "2024-01-15", notes: "Distemper combo" },
      { medical_record_id: medicalRecordsData[1]!.id, name: "FVRCP", date: "2024-02-20", notes: "Annual booster" },
      { medical_record_id: medicalRecordsData[2]!.id, name: "DHPP", date: "2024-03-10", notes: "Annual booster" },
      { medical_record_id: medicalRecordsData[2]!.id, name: "Rabies", date: "2024-03-10", notes: null },
      { medical_record_id: medicalRecordsData[3]!.id, name: "Rabies", date: "2024-06-01", notes: "First dose" },
      { medical_record_id: medicalRecordsData[4]!.id, name: "FVRCP", date: "2024-04-15", notes: "Annual booster" },
      { medical_record_id: medicalRecordsData[5]!.id, name: "DHPP", date: "2023-12-20", notes: "Annual booster" },
      { medical_record_id: medicalRecordsData[5]!.id, name: "Bordetella", date: "2024-01-10", notes: "Kennel cough vaccine" },
      // New dogs
      { medical_record_id: medicalRecordsData[6]!.id, name: "Rabies", date: "2024-05-10", notes: null },
      { medical_record_id: medicalRecordsData[6]!.id, name: "DHPP", date: "2024-05-10", notes: null },
      { medical_record_id: medicalRecordsData[7]!.id, name: "DHPP", date: "2024-03-22", notes: null },
      { medical_record_id: medicalRecordsData[8]!.id, name: "Rabies", date: "2024-07-05", notes: null },
      { medical_record_id: medicalRecordsData[9]!.id, name: "DHPP", date: "2024-08-15", notes: "Sensitive stomach noted" },
      { medical_record_id: medicalRecordsData[10]!.id, name: "Rabies", date: "2024-04-01", notes: null },
      { medical_record_id: medicalRecordsData[11]!.id, name: "DHPP", date: "2024-02-28", notes: null },
      { medical_record_id: medicalRecordsData[12]!.id, name: "Rabies", date: "2024-10-01", notes: "Puppy first dose" },
      { medical_record_id: medicalRecordsData[13]!.id, name: "DHPP", date: "2024-06-18", notes: null },
      { medical_record_id: medicalRecordsData[13]!.id, name: "Bordetella", date: "2024-06-18", notes: null },
      { medical_record_id: medicalRecordsData[14]!.id, name: "Rabies", date: "2024-09-12", notes: null },
      { medical_record_id: medicalRecordsData[15]!.id, name: "DHPP", date: "2024-05-25", notes: null },
      // Cats - FVRCP
      { medical_record_id: medicalRecordsData[16]!.id, name: "FVRCP", date: "2024-04-08", notes: null },
      { medical_record_id: medicalRecordsData[17]!.id, name: "FVRCP", date: "2024-01-22", notes: null },
      { medical_record_id: medicalRecordsData[18]!.id, name: "FVRCP", date: "2024-07-14", notes: null },
      { medical_record_id: medicalRecordsData[19]!.id, name: "FVRCP", date: "2024-03-30", notes: null },
      { medical_record_id: medicalRecordsData[20]!.id, name: "FVRCP", date: "2024-06-02", notes: null },
      { medical_record_id: medicalRecordsData[21]!.id, name: "FVRCP", date: "2024-08-20", notes: "Kitten series" },
      { medical_record_id: medicalRecordsData[22]!.id, name: "FVRCP", date: "2024-02-14", notes: null },
      { medical_record_id: medicalRecordsData[23]!.id, name: "FVRCP", date: "2024-05-05", notes: null },
      // Birds - Polyomavirus
      { medical_record_id: medicalRecordsData[24]!.id, name: "Polyomavirus", date: "2024-04-12", notes: null },
      { medical_record_id: medicalRecordsData[25]!.id, name: "Polyomavirus", date: "2024-06-28", notes: null },
      { medical_record_id: medicalRecordsData[26]!.id, name: "Polyomavirus", date: "2024-03-15", notes: null },
      // Rabbit
      { medical_record_id: medicalRecordsData[29]!.id, name: "RHDV", date: "2024-04-18", notes: "Rabbit hemorrhagic disease" },
    ]);

    console.log("✅ Created vaccinations");

    // 8. Create Pet Images
    console.log("📸 Creating pet images...");
    const petImagesData = petsData.map((pet, index) => ({
      pet_id: pet.id,
      image_url: petImageUrls[index]!,
      is_primary: true,
      display_order: 1,
    }));
    // Add extra image for Max
    petImagesData.push({
      pet_id: petsData[0]!.id,
      image_url:
        "https://images.dog.ceo/breeds/retriever-golden/n02099601_2209.jpg",
      is_primary: false,
      display_order: 2,
    });
    await db.insert(pet_images).values(petImagesData);

    console.log(`✅ Created ${petImagesData.length} pet images`);

    // 9. Create Adoption Posts
    console.log("📝 Creating adoption posts...");

    // Create adoption posts for all pets with status "adopting"
    const adoptablePets = petsData.filter((pet) => pet.pet_status === "adopting");
    const addresses = [
      "123 Main St, Seattle, WA 98101",
      "456 Oak Ave, Portland, OR 97201",
      "789 Pine St, San Francisco, CA 94102",
      "321 Elm St, Los Angeles, CA 90001",
      "654 Maple Dr, Austin, TX 73301",
    ];
    const contacts = [
      "+1-206-555-0101",
      "+1-503-555-0202",
      "+1-415-555-0303",
      "+1-213-555-0404",
      "+1-512-555-0505",
    ];
    const adoptionPostValues = adoptablePets.map((pet, index) => {
      const customerIndex = index % 5;
      return {
        pet_id: pet.id,
        owner: customersData[customerIndex].id,
        price: Math.floor(Math.random() * 300) + 50, // Random price $50-$350
        address: addresses[customerIndex],
        contact: contacts[customerIndex],
        notes: `${pet.name} is looking for a loving forever home. ${pet.notes}`,
        post_status: "active" as const,
      };
    });

    const adoptionPostsData = await db
      .insert(adoption_posts)
      .values(adoptionPostValues)
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
        customer_id: customersData[2]!.id,
        adoption_post_id: adoptionPostsData[0]!.id,
      },
      {
        customer_id: customersData[2]!.id,
        adoption_post_id: adoptionPostsData[2]!.id,
      },
      {
        customer_id: customersData[3]!.id,
        adoption_post_id: adoptionPostsData[0]!.id,
      },
      {
        customer_id: customersData[3]!.id,
        adoption_post_id: adoptionPostsData[4]!.id,
      },
      {
        customer_id: customersData[4]!.id,
        adoption_post_id: adoptionPostsData[1]!.id,
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
    console.log(`   - ${petsData.length} pet medical records`);
    console.log(`   - ${petImagesData.length} pet images`);
    console.log(`   - ${adoptionPostsData.length} adoption posts`);
    console.log(`   - ${applicationsData.length} adoption applications`);
    console.log(`   - ${transactionsData.length} adoption transactions`);
    console.log("   - 1 adoption review");
    console.log("   - 5 messages");
    console.log("   - 5 favorites");

    console.log(
      '\n✅ All seed accounts use password: "password123" for testing',
    );
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    process.exit(0);
  }
}

seed();
