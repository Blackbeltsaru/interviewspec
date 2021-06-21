CREATE DATABASE video_player_db;
USE video_player_db;

-- Its probably prudent to set up an index on the table, 
-- Its not really worth it currently so ignore for now
CREATE TABLE IF NOT EXISTS videos (
	video_id INT NOT NULL PRIMARY KEY auto_increment,
    title VARCHAR(128) NOT NULL,
    file_path VARCHAR(120) NOT NULL,
    -- Edit Status: 
    -- 1 : Editable
    -- 2 : Readable
    -- 4 : Hidden
    edit_status INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
