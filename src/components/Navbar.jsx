// src/components/Navbar.jsx

import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, InputBase, Menu, MenuItem, Avatar, Badge, List, ListItem, Divider, ListItemAvatar, ListItemText, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { styled } from '@mui/system';

const SearchBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: '#fff',
  borderRadius: 4,
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  marginRight: theme.spacing(2),
}));

function timeSince(date) {
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'acum';

  const intervals = [
    { label: 'an', seconds: 31536000 },
    { label: 'lună', seconds: 2592000 },
    { label: 'săptămână', seconds: 604800 },
    { label: 'zi', seconds: 86400 },
    { label: 'oră', seconds: 3600 },
    { label: 'min', seconds: 60 },
  ];

  for (let i = 0; i < intervals.length; i++) {
    const interval = intervals[i];
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      if (count === 1) {
        return `acum 1 ${interval.label}`;
      } else {
        let label = interval.label;
        if (interval.label === 'oră') label = 'ore';
        else if (interval.label === 'zi') label = 'zile';
        else if (interval.label === 'săptămână') label = 'săptămâni';
        else if (interval.label === 'lună') label = 'luni';
        else if (interval.label === 'an') label = 'ani';
        return `acum ${count} ${label}`;
      }
    }
  }

  return 'acum';
}

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'follow',
      username: 'andrei',
      avatar: '/static/images/avatar/andrei.jpg',
      is_following: false,
      seen: false,
      timestamp: new Date(new Date().getTime() - 20000),
    },
    {
      id: 2,
      type: 'general',
      message: 'Ai o notificare nouă.',
      seen: false,
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 5),
    },
    {
      id: 3,
      type: 'follow',
      username: 'maria',
      avatar: '',
      is_following: true,
      seen: false,
      timestamp: new Date(new Date().getTime() - 1000 * 60 * 60 * 2),
    },
  ]);

  const unseenCount = notifications.filter((n) => !n.seen).length;

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseMenu();
    // Navigarea este deja gestionată în UserContext
  };

  let avatarLetters = 'NA';
  if (user && user.username) {
    const uname = user.username.trim();
    if (uname.length >= 2) {
      avatarLetters = uname.substring(0, 2).toUpperCase();
    } else if (uname.length === 1) {
      avatarLetters = uname.substring(0, 1).toUpperCase();
    }
  }

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleFollowToggle = async (notif) => {
    // Implementare funcție dacă este necesar
    console.log('Follow toggle pentru:', notif.username);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          PoliSocial
        </Typography>
        {user && (
          <>
            <SearchBox>
              <SearchIcon />
              <InputBase
                placeholder="Caută..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleSearch}
              />
            </SearchBox>
          </>
        )}
        {user && (
          <>
            <IconButton color="inherit" onClick={handleNotificationsClick}>
              <Badge badgeContent={unseenCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notificationsAnchorEl}
              open={Boolean(notificationsAnchorEl)}
              onClose={handleNotificationsClose}
              PaperProps={{
                style: {
                  maxHeight: 300,
                  width: '360px',
                },
              }}
            >
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {notifications.length === 0 && (
                  <Typography textAlign="center" sx={{ p: 2 }}>
                    Nu ai notificări
                  </Typography>
                )}
                {notifications.map((notif, index) => (
                  <React.Fragment key={notif.id}>
                    <ListItem alignItems="flex-start" sx={{ alignItems: 'center' }}>
                      <ListItemAvatar>
                        {notif.type === 'follow' && notif.avatar ? (
                          <Avatar alt={notif.username} src={`http://localhost:8000${notif.avatar}`} />
                        ) : notif.type === 'follow' ? (
                          <Avatar>{notif.username.substring(0, 1).toUpperCase()}</Avatar>
                        ) : (
                          <Avatar>
                            <NotificationsIcon />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          notif.type === 'follow' ? (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              <Typography variant="body1" component="span">
                                <Link
                                  to={`/profile/${notif.username}`}
                                  style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                                >
                                  {notif.username}
                                </Link>{' '}
                                a început să te urmărească
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button variant="contained" size="small" onClick={() => handleFollowToggle(notif)}>
                                  {notif.is_following ? 'Urmărești deja' : 'Urmărește'}
                                </Button>
                              </Box>
                            </Box>
                          ) : (
                            notif.message
                          )
                        }
                        secondary={timeSince(notif.timestamp)}
                      />
                      {notif.type === 'general' && (
                        <Box sx={{ ml: 2 }}>
                          <Button
                            onClick={() => {
                              handleNotificationsClose();
                              navigate('/some-general-route/');  // Înlocuiește cu ruta corectă
                            }}
                          >
                            Vezi
                          </Button>
                        </Box>
                      )}
                    </ListItem>
                    {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                  </React.Fragment>
                ))}
              </List>
            </Menu>
            <IconButton onClick={handleAvatarClick} sx={{ ml: 1 }}>
              {user.avatar ? (
                <Avatar src={`http://localhost:8000${user.avatar}`} alt={user.username} />
              ) : (
                <Avatar>{avatarLetters}</Avatar>
              )}
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate(`/profile/${user?.username || ''}`);
                }}
              >
                Profil
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        )}
        {!user && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
