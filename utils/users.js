// this could be replaced by a db
const users = [];

// join user to chat
function userJoin(id, username, room) 
{
    const user = {id, username, room};
    users.push(user);
    return user;
}

// get current users
function getCurrentUser(id)
{
    // find and return the user that matches id
    return users.find(user => user.id === id);
}

// user leaves chat
function userLeave(id)
{
    const idx = users.findIndex(user => user.id === id);

    // if not found, idx will be -1
    if(idx !== -1)
    {
        // delete and return user found by id
        return users.splice(idx, 1)[0];
    }
}

// get all the users in a room
function getRoomUsers(room)
{
    return users.filter(user => user.room === room);
}

// export
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}