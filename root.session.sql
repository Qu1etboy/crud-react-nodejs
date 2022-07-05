-- @BLOCK
CREATE TABLE Users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255),
  password VARCHAR(255)
);
-- @Block
SELECT *
FROM Users;

-- @BLOCK
CREATE TABLE Posts(
  postId INT AUTO_INCREMENT PRIMARY KEY,
  userID INT,
  post VARCHAR(255)
);
-- @Block
SELECT *
FROM Posts;
-- @BLOCK
TRUNCATE TABLE Posts;
-- @BLOCK
TRUNCATE TABLE Users;