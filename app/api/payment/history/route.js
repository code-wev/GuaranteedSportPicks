export const GET = async (req) => {
    return NextResponse.json({
        message:"success"
    }, { status: 200 });
}