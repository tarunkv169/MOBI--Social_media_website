import Post from "./Post";

const Posts = () => {
  return (
    <div>
        {
            [1,2,3,4].map((item,index)=>{ return <Post key={index}/>})  // iam not using return of map thats why error
        }
    </div>
  )
};

export default Posts;
