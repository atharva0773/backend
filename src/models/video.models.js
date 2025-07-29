import mongoosef ,{Schema}from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const VideoSchema = new Schema({
videofile:{
    type:String,
    required: true,

},
thumbnail:{
    type:string,
    required:true,
},
title:{
    type:string,
    required:true,
},
description:{
    type:string,
    required:true,
},
duration:{
    type:Number,
    required:true,
},
view:{
    type:Number,
    default:0,
},
isPublished:{
    type:Boolean,
    default:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
}



},{timestamps:true})

VideoSchema.plugin(mongooseAggregatePaginate)
export const Video = mongoose.model("Video",VideoSchema)