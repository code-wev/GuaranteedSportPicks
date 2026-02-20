export const POST = async (req) => {
  try {
    const data = await req.json();
    const { img } = data; // Base64 image expected

    if (!img) {
      return Response.json(
        { success: false, message: "Image is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.IMGBB_KEY;

    // Prepare form data for imgbb
    const formData = new FormData();
    formData.append("key", apiKey);
    formData.append("image", img);

    // Upload to imgbb
    const uploadReq = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const result = await uploadReq.json();

    if (!result.success) {
      return Response.json(
        { success: false, message: "Failed to upload image" },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      url: result.data.url, // final image url
      deleteUrl: result.data.delete_url,
    });
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong", error },
      { status: 500 }
    );
  }
};
