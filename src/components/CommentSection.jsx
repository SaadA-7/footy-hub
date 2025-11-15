import { useState, useEffect } from 'react';
import { supabase } from '../client';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from('comments')
      .select()
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (newComment.trim() === '') {
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          post_id: postId,
          comment_text: newComment
        }
      ])
      .select();

    if (error) {
      console.error('Error adding comment:', error);
    } else {
      setComments([data[0], ...comments]);
      setNewComment('');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="comments-section">
      <h3>Comments ({comments.length})</h3>

      <form onSubmit={handleSubmitComment} className="comment-form">
        <textarea
          className="comment-input"
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">
          Post Comment
        </button>
      </form>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-meta">
                {formatDate(comment.created_at)}
              </div>
              <p className="comment-text">{comment.comment_text}</p>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;