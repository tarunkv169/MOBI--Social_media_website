import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

export const sendMessage=async(req,res)=>{
    try {
        // PHASE1️⃣ Message Schema deal
    
            // retrieve msg schema creds
            const senderId = req.id;
            const recieverId = req.params.id;
            const {message} = req.body;
        
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
        const recieverId = req.id;
        const senderId = req.params.id;
    
        let conversation = await Conversation.find({
            participants:{$all:[senderId,recieverId]}
        })
    
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