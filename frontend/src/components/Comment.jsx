import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Badge } from './ui/badge';


const Comment = ({ comment }) => {
    
    const {selectedPost} = useSelector(store=>store.post);
    const user = useSelector(store=>store.auth.user);
    return (
        <div className='my-1'>
            <div className='flex items-center gap-3'>
                <Link>
                    <Avatar>
                        <AvatarImage src={comment?.commentedBy?.profilePicture} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
                <div className="flex items-center gap-2">
                    <h1 className='font-bold text-sm'>{comment?.commentedBy?.username}</h1> 
                    { user?._id === comment?.commentedBy?._id &&  <Badge>Author</Badge> }
                    <span className='font-normal pl-1'>{comment?.content}</span>
                </div>
            </div>
        </div>
    )
};

Comment.propTypes = {
    comment: PropTypes.object.isRequired, // Updated from func to object
};

export default Comment;
