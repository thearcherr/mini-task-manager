import supabase from "@/app/database/db";

export async function GET() {
  let { data: tasks, error } = await supabase
    .from("tasks")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
  return new Response(JSON.stringify({ tasks }), { status: 200 });
}

export async function POST(request) {
  try {
    const { title, description } = await request.json();

    console.log("Creating Task:", title, description);

    const { data, error } = await supabase
      .from("tasks")
      .insert([{ name: title, description, completed: 0 }])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(
      JSON.stringify({ message: "Task created successfully", task: data }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Request parsing error:", err);
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
    });
  }
}

