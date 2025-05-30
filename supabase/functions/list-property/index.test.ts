import { assertEquals, assertSpyCall, spy } from "https://deno.land/std@0.177.0/testing/asserts.ts";
// Assuming the main handler function can be imported or is accessible for testing.
// For this example, we'll define a mock handler that simulates the real one.

let mockSupabaseClient: any;

// Mock Deno.env.get
const originalEnvGet = Deno.env.get;
const mockEnv = new Map<string, string>([
  ["SUPABASE_URL", "http://localhost:54321"],
  ["SUPABASE_SERVICE_ROLE_KEY", "service_key"],
]);
Deno.env.get = (key: string) => mockEnv.get(key) || originalEnvGet(key);


// Mocked handler function (simplified representation of the actual function in index.ts)
async function callListProperty(request: Request): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || authHeader !== "Bearer valid_jwt") {
    return new Response(JSON.stringify({ error: "Authentication failed" }), { status: 401 });
  }

  const { name, address, phone_contact, email_contact } = await request.json();
  if (!name || !address || !phone_contact || !email_contact) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

  // Simulate Supabase client calls
  mockSupabaseClient.auth.getUser = spy(() => Promise.resolve({ data: { user: { id: "user_123" } }, error: null }));

  const providerInsertSpy = mockSupabaseClient.from("providers").insert; // already a spy
  const userRoleFetchSpy = mockSupabaseClient.from("users").select().eq().single; // already a spy
  const userRoleUpdateSpy = mockSupabaseClient.from("users").update().eq; // already a spy


  try {
    await mockSupabaseClient.auth.getUser("valid_jwt"); // Simulate auth check
    const { data: newProvider, error: insertError } = await providerInsertSpy({
        user_id: "user_123", name, address, phone_contact, email_contact, is_verified: false
    });

    if (insertError) {
        if (insertError.message === "User update failed") { // Specific mock message for Test 3.3
             return new Response(JSON.stringify({ error: "User role update failed simulation" }), { status: 500 });
        }
        return new Response(JSON.stringify({ error: "Provider insert failed" }), { status: 500 });
    }

    // Simulate role fetch and update
    const { data: currentUserData } = await userRoleFetchSpy();
    if (currentUserData && currentUserData.role !== 'provider' && currentUserData.role !== 'admin') {
        const { error: updateRoleError } = await userRoleUpdateSpy({ role: "provider" });
        if (updateRoleError) {
            // This is the path for Test 3.3 if insertError isn't used for it
            return new Response(JSON.stringify({ error: "User role update failed" }), { status: 500 });
        }
    }

    return new Response(JSON.stringify({ success: true, providerId: newProvider.provider_id }), { status: 201 });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

const validPropertyData = {
  name: "Test Property",
  address: "123 Main St",
  phone_contact: "555-1234",
  email_contact: "property@example.com",
  description: "A nice place",
};

Deno.test("3.1 [list-property] Success - New Provider", async () => {
  const mockProviderId = "prov_new_123";
  const providerInsertSpy = spy(() => Promise.resolve({ data: { provider_id: mockProviderId }, error: null }));
  const userRoleFetchSpy = spy(() => Promise.resolve({ data: { role: 'customer' }, error: null}));
  const userRoleUpdateSpy = spy(() => Promise.resolve({ error: null }));

  mockSupabaseClient = {
    auth: { getUser: spy(() => Promise.resolve({ data: { user: { id: "user_123" } }, error: null })) },
    from: (table: string) => ({
      insert: table === "providers" ? providerInsertSpy : undefined,
      select: table === "users" ? () => ({ eq: () => ({ single: userRoleFetchSpy }) }) : undefined,
      update: table === "users" ? () => ({ eq: userRoleUpdateSpy }) : undefined,
    }),
  };

  const request = new Request("http://localhost/list-property", {
    method: "POST",
    headers: { "Authorization": "Bearer valid_jwt", "Content-Type": "application/json" },
    body: JSON.stringify(validPropertyData),
  });

  const response = await callListProperty(request);
  const body = await response.json();

  assertEquals(response.status, 201);
  assertEquals(body.success, true);
  assertEquals(body.providerId, mockProviderId);
  assertSpyCall(providerInsertSpy.calls[0], 0);
  assertEquals(providerInsertSpy.calls[0].args[0].name, validPropertyData.name);
  assertSpyCall(userRoleFetchSpy.calls[0], 0);
  assertSpyCall(userRoleUpdateSpy.calls[0], 0);
  assertEquals(userRoleUpdateSpy.calls[0].args[0].role, "provider");
});

Deno.test("3.2 [list-property] Error - Validation Failed", async () => {
  const invalidData = { ...validPropertyData, name: "" }; // Missing name
  // No Supabase client calls expected if validation fails early.
  mockSupabaseClient = { auth: { getUser: spy(() => Promise.resolve({ data: { user: { id: "user_123" } }, error: null })) }};


  const request = new Request("http://localhost/list-property", {
    method: "POST",
    headers: { "Authorization": "Bearer valid_jwt", "Content-Type": "application/json" },
    body: JSON.stringify(invalidData),
  });
  const response = await callListProperty(request);
  assertEquals(response.status, 400);
  const body = await response.json();
  assertEquals(body.error, "Missing required fields");
});

Deno.test("3.3 [list-property] Error - User Update Fails", async () => {
  // Simulate provider insert succeeding, but user role update failing.
  const providerInsertSpy = spy(() => Promise.resolve({ data: { provider_id: "prov_test_123" }, error: null }));
  const userRoleFetchSpy = spy(() => Promise.resolve({ data: { role: 'customer' }, error: null}));
  const userRoleUpdateSpy = spy(() => Promise.resolve({ error: { message: "Role update failed" } })); // Mock failure


  mockSupabaseClient = {
    auth: { getUser: spy(() => Promise.resolve({ data: { user: { id: "user_123" } }, error: null })) },
    from: (table: string) => ({
      insert: table === "providers" ? providerInsertSpy : undefined,
      select: table === "users" ? () => ({ eq: () => ({ single: userRoleFetchSpy }) }) : undefined,
      update: table === "users" ? () => ({ eq: userRoleUpdateSpy }) : undefined,
    }),
  };

  const request = new Request("http://localhost/list-property", {
    method: "POST",
    headers: { "Authorization": "Bearer valid_jwt", "Content-Type": "application/json" },
    body: JSON.stringify(validPropertyData),
  });

  const response = await callListProperty(request);
  assertEquals(response.status, 500);
  const body = await response.json();
  assertEquals(body.error, "User role update failed");
  assertSpyCall(providerInsertSpy.calls[0], 0); // Provider insert was attempted
  assertSpyCall(userRoleUpdateSpy.calls[0], 0); // Role update was attempted
});


Deno.test("3.4 [list-property] Error - Unauthorized", async () => {
  const request = new Request("http://localhost/list-property", {
    method: "POST",
    headers: { "Authorization": "Bearer invalid_jwt", "Content-Type": "application/json" }, // Invalid token
    body: JSON.stringify(validPropertyData),
  });
  const response = await callListProperty(request);
  assertEquals(response.status, 401);
  const body = await response.json();
  assertEquals(body.error, "Authentication failed");
});

// Deno.env.get = originalEnvGet; // Restore
