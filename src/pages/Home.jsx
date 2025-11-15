import { useState, useEffect } from 'react';
import { supabase } from '../client';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [orderBy, setOrderBy] = useState('created_at');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, [orderBy]);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, posts]);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select()
      .order(orderBy, { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      setPosts(data);
      setFilteredPosts(data);
    }
  };

  const filterPosts = () => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  };

  const handleSortChange = (sortBy) => {
    setOrderBy(sortBy);
  };

  return (
    <div className="home">
      <div className="controls">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <div className="sort-buttons">
          <button
            className={`sort-btn ${orderBy === 'created_at' ? 'active' : ''}`}
            onClick={() => handleSortChange('created_at')}
          >
            Newest
          </button>
          <button
            className={`sort-btn ${orderBy === 'upvotes' ? 'active' : ''}`}
            onClick={() => handleSortChange('upvotes')}
          >
            Most Popular
          </button>
        </div>
      </div>

      <div className="posts-grid">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="no-posts">
            <p>No posts found. Be the first to create one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;