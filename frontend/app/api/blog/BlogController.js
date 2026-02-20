import { dbConnect } from "@/lib/dbConnect"
import { Blog } from "./BlogModel";

export const saveBlog = async(data)=>{
    await dbConnect();
    const newBlog = new Blog(data);
    const saved = await newBlog.save();
    return saved
}


export const deleteBlog = async(id)=>{
    await dbConnect();
 
    const deleted = await Blog.deleteOne({_id:id});
    return deleted;
}



export const publishBlog = async(id)=>{
    await dbConnect();
    const updated = await Blog.updateOne({
        _id:id
    }, {$set:{
        status:"publish"
    }});
    return updated

}
export const draftBlog = async(id)=>{
    await dbConnect();
    const updated = await Blog.updateOne({
        _id:id
    }, {$set:{
        status:"draft"
    }});
    return updated

}

export const updateBlog = async(data)=>{
    await dbConnect();
    console.log(data, "This is data")
    const id = data.id
    const updated = await Blog.updateOne({
        _id:id,
    }, {$set:{

        title:data?.title,
        category:data?.category,
        img:data?.img,
        content:data?.content,
        
    }});

    console.log(updated, "haha kar")
    return updated
}

