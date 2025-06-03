// GET /api/users
export const getUserData = async (req, res) => {
  try {
    const role = req.user.role;
    const recentSearchedCities = req.user.recentSearchedCities;

    res.status(200).json({
      success: true,
      message: 'User data fetched successfully',
      role,
      recentSearchedCities,
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Store User Recent Searched cities
export const storeRecentSearchedcities = async (req, res) => {
  try {
    const { recentSearchedCity } = req.body;
    const user = req.user;

    if (user.recentSearchedCities.length < 3) {
      user.recentSearchedCities.push(recentSearchedCity);
    } else {
      user.recentSearchedCities.shift();
      user.recentSearchedCities.push(recentSearchedCity);
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: 'City added',
    });
  } catch (error) {
    console.error('Error storing recent searched city:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
