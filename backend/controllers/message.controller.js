import Conversation from "../models/conversation.model.js";// .js is must in import
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage=async(req,res)=>{
    try {
        // PHASE1️⃣ Message Schema deal
    
            // retrieve msg schema creds
            const senderId = req.id;
            const recieverId = req.params.id;
            const {textMessage:message} = req.body;
        
            // create a new message in dbs
            const newMsg = await Message.create({
                senderId,
                recieverId,
                message
            })
    
        // PHASE2️⃣ Conversation Schema deal
    
            // check if there is already having conversation b/w participants ....then just add this newmsg
            let conversation = await Conversation.findOne( { participants : { $all: [senderId,recieverId] } } ); // $all--pure participants array mein ye combi check karo 
            if(!conversation)
            {
                // if not yet conversation ...then create...with this new participants
                conversation = await Conversation.create({
                    participants: [senderId,recieverId]   // participants array mein ye combi daal do
                })
            }
        
            if(newMsg){
                conversation.messages.push(newMsg._id);
            }
    
        // PHASE3️⃣ Save both dbs
        await Promise.all( [ newMsg.save(), conversation.save() ] );

        // get socketID and emit newMsg to that 
        // for adding (this newMsg saved in dbs)--to--(allmsgs(for dbs & redux))
        const recieverSocketId = getReceiverSocketId(recieverId);
        io.to(recieverSocketId).emit("newMsg",newMsg);
    
        return res.status(200).json({
            success:true,
            newMsg
        })
    } catch (error) {
        console.log(error);
    }
}


export const getMessage=async(req,res)=>{
    try {
        const senderId = req.id;
        const recieverId = req.params.id;
    
        let conversation = await Conversation.findOne({
            participants:{$all:[senderId,recieverId]}
        }).populate("messages");
    
        if(!conversation)   // if there is not any conver then we return with empty msgs...true
        {
            return res.status(200).json({
                success:true,
                messages:[]
            })
        }
    
        return res.status(200).json({
            success:true,
            messages:conversation?.messages
    })
    } catch (error) {
        console.log(error);
    }
}