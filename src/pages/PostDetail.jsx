import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../client';
import CommentSection from '../components/CommentSection';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
    }
  };

  const handleUpvote = async () => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: post.upvotes + 1 })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error upvoting post:', error);
    } else {
      setPost(data[0]);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      } else {
        navigate('/');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-detail">
      <div className="post-detail-header">
        <h1 className="post-detail-title">{post.title}</h1>
        <div className="post-actions">
          <Link to={`/edit/${post.id}`}>
            <button className="btn btn-secondary btn-small">Edit</button>
          </Link>
          <button className="btn btn-danger btn-small" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>

      <div className="post-meta">
        <span>Posted on {formatDate(post.created_at)}</span>
        <span>{post.upvotes} upvotes</span>
      </div>

      {post.content && (
        <div className="post-content">
          <p>{post.content}</p>
        </div>
      )}

      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
          className="post-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}

      <div className="upvote-section">
        <button className="upvote-btn" onClick={handleUpvote}>
           Upvote ({post.upvotes})
        </button>
      </div>

      <CommentSection postId={post.id} />
    </div>
  );
};

export default PostDetail;