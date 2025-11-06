import supabase from "@/app/database/db";

export async function POST(request) {
    try {
        const { id } = await request.json();

        console.log("Completing Task ID:", id);

        const { data, error } = await supabase
            .from("tasks")
            .update({ completed: 1 })
            .eq("id", id)
            .select();
        
        if (error) {
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
            });
        }
        return new Response(
            JSON.stringify({ message: "Task completed successfully", task: data }),
            { status: 200 }
        );

    } catch (err) {
        console.error("Request parsing error:", err);
        return new Response(JSON.stringify({ error: "Invalid request body" }), {
            status: 400,
        });
    }
}