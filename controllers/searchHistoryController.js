const SearchHistory = require('../controllers/SearchHistoryModel');

const saveSearchHistory = async (userId, keyword) => {
    try {
      if (!userId || !keyword) {
        throw new Error('User ID and keyword are required');
      }
  
      await SearchHistory.create({ userId, keyword });
      return { message: 'Search history saved' };
    } catch (error) {
      console.error('Error saving search history:', error.message);
      throw new Error(error.message || 'Failed to save search history');
    }
  };

  const getSearchHistory = async (userId) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
  
      const history = await SearchHistory.find({ userId }).sort({ createdAt: -1 }).limit(5);
      return history;
    } catch (error) {
      throw new Error(error.message || 'Failed to fetch search history');
    }
  };


const deleteSearchHistory = async (searchid) => {
    try {
        console.log('Processing deletion for ID:', searchid); 

        if (!searchid) {
            throw new Error('Search ID is required');
        }
        const result = await SearchHistory.findByIdAndDelete(searchid); 
        if (!result) {
            throw new Error('No search history found with this ID');
        }
        return { message: 'Search history deleted' };
    } catch (error) {
        throw new Error(error.message || 'Failed to delete search history');
    }
};

module.exports ={
    saveSearchHistory,
    getSearchHistory,
    deleteSearchHistory,
}