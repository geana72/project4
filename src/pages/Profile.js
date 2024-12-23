// src/pages/Profile.jsx

import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import { UserContext } from '../contexts/UserContext';
import {
  Box,
  Grid,
  Avatar,
  Typography,
  Button,
  useMediaQuery,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Skeleton
} from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ContainerBox = styled(Box)(({ theme }) => ({
  maxWidth: '975px',
  margin: '0 auto',
  padding: theme.spacing(4),
  backgroundColor: '#fff',
  color: '#000',
}));

const AvatarWrapper = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(18),
  height: theme.spacing(18),
}));

const FollowButton = styled(Button)(({ isfollowing, theme }) => ({
  textTransform: 'none',
  borderRadius: '4px',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  color: '#fff',
  backgroundColor: isfollowing === 'true' ? '#dbdbdb' : '#0095f6',
  '&:hover': {
    backgroundColor: isfollowing === 'true' ? '#c0c0c0' : '#1877f2',
  },
}));

const EditProfileButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: '4px',
  fontWeight: 600,
  padding: theme.spacing(1.5, 4),
  backgroundColor: '#fff',
  border: '1px solid #dbdbdb',
  color: '#000',
  '&:hover': {
    backgroundColor: '#f2f2f2',
  },
}));

const StatsBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(6),
  marginTop: theme.spacing(2),
}));

const BioBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

function Profile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const p = await userService.getProfile(username);
        setProfile(p);
        setIsOwner(p.is_owner);
        setIsFollowing(p.is_following);
        setFollowersCount(p.followers_count);
        setFollowingCount(p.following_count);
        setFollowersList(Array.isArray(p.followers) ? p.followers : []);
      } catch (err) {
        console.error('Fetch profile failed:', err);
        setErrorMessage('Profilul nu a putut fi încărcat.');
      }
    };
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      const response = await userService.follow(username);
      setIsFollowing(response.is_following);
      setFollowersCount(response.followers_count);
      setFollowingCount(response.following_count);
      if (response.is_following && currentUser) {
        // Adaugă utilizatorul curent la lista de urmăritori
        setFollowersList((prev) => [
          ...prev,
          { id: currentUser.id, username: currentUser.username, avatar: currentUser.avatar },
        ]);
      } else if (!response.is_following && currentUser) {
        // Elimină utilizatorul curent din lista de urmăritori
        setFollowersList((prev) => prev.filter((follower) => follower.id !== currentUser.id));
      }
    } catch (err) {
      console.error('Error following user:', err);
      setErrorMessage('Nu s-a putut finaliza acțiunea.');
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  if (errorMessage)
    return (
      <Box textAlign="center" mt={4}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );

  // Dacă profilul încă nu este încărcat, afișăm Skeleton-uri
  if (!profile) {
    return (
      <ContainerBox>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
              <Skeleton variant="circular" width={144} height={144} />
              <StatsBox>
                <Box textAlign={isSmallScreen ? 'center' : 'left'}>
                  <Skeleton width={40} height={30} />
                  <Typography>Postări</Typography>
                </Box>
                <Box textAlign={isSmallScreen ? 'center' : 'left'}>
                  <Skeleton width={40} height={30} />
                  <Typography>Urmăritori</Typography>
                </Box>
                <Box textAlign={isSmallScreen ? 'center' : 'left'}>
                  <Skeleton width={40} height={30} />
                  <Typography>Urmărești</Typography>
                </Box>
              </StatsBox>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Skeleton width={100} height={40} />
                <Skeleton variant="rectangular" width={120} height={40} />
              </Box>
              <BioBox sx={{ textAlign: isSmallScreen ? 'center' : 'left', width: '100%', mt:2 }}>
                <Skeleton width="60%" height={20} />
                <Skeleton width="40%" height={20} />
              </BioBox>
              <Box mt={4} width={isSmallScreen ? '100%' : 'auto'}>
                <Typography variant="h6" gutterBottom>
                  Urmăritori
                </Typography>
                <List>
                  <ListItem>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ ml: 2 }}>
                      <Skeleton width={100} height={20} />
                    </Box>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                  <ListItem>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box sx={{ ml: 2 }}>
                      <Skeleton width={100} height={20} />
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Postările lui {profile.username}
            </Typography>
            <Typography>Nicio postare disponibilă.</Typography>
          </Grid>
        </Grid>
      </ContainerBox>
    );
  }

  // Generare litere pentru avatar dacă nu există imagine
  let avatarLetters = 'NA';
  if (profile && profile.username) {
    const uname = profile.username.trim();
    if (uname.length >= 2) {
      avatarLetters = uname.substring(0, 2).toUpperCase();
    } else if (uname.length === 1) {
      avatarLetters = uname.substring(0, 1).toUpperCase();
    }
  }

  return (
    <ContainerBox>
      <Grid container spacing={4}>
        {/* Avatar și Statistici */}
        <Grid item xs={12} sm={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
            <AvatarWrapper
              src={profile.avatar ? `http://localhost:8000${profile.avatar}` : ''}
              alt={profile.username}
            >
              {!profile.avatar && avatarLetters}
            </AvatarWrapper>
            <StatsBox>
              <Box textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {followersCount}
                </Typography>
                <Typography>Urmăritori</Typography>
              </Box>
              <Box textAlign={isSmallScreen ? 'center' : 'left'}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {followingCount}
                </Typography>
                <Typography>Urmărești</Typography>
              </Box>
            </StatsBox>
          </Box>
        </Grid>

        {/* Informații și Acțiuni */}
        <Grid item xs={12} sm={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isSmallScreen ? 'center' : 'flex-start' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant={isSmallScreen ? 'h5' : 'h4'} sx={{ fontWeight: 'bold' }}>
                {profile.username}
              </Typography>
              {isOwner ? (
                <EditProfileButton onClick={handleEditProfile} startIcon={<EditIcon />}>
                  Editare profil
                </EditProfileButton>
              ) : (
                <FollowButton isfollowing={isFollowing.toString()} onClick={handleFollow} startIcon={<AddIcon />}>
                  {isFollowing ? 'Urmărești deja' : 'Urmărește'}
                </FollowButton>
              )}
            </Box>

            {/* Bio */}
            <BioBox sx={{ textAlign: isSmallScreen ? 'center' : 'left' }}>
              {profile.detalii && (
                <Typography sx={{ mt: 1, fontWeight: 500 }}>{profile.detalii}</Typography>
              )}
              {profile.localitate_curenta && (
                <Typography>
                  <strong>Localitate Curentă:</strong> {profile.localitate_curenta}
                </Typography>
              )}
              {profile.serviciu_curent && (
                <Typography>
                  <strong>Serviciu Curent:</strong> {profile.serviciu_curent}
                </Typography>
              )}
              {profile.localitate_dorita && (
                <Typography>
                  <strong>Localitate Dorită:</strong> {profile.localitate_dorita}
                </Typography>
              )}
              {profile.serviciu_dorit && (
                <Typography>
                  <strong>Serviciu Dorit:</strong> {profile.serviciu_dorit}
                </Typography>
              )}
            </BioBox>

            {/* Lista de Urmăritori */}
            <Box mt={4} width={isSmallScreen ? '100%' : 'auto'}>
              <Typography variant="h6" gutterBottom>
                Urmăritori
              </Typography>
              <List>
                {followersList.map((follower) => (
                  <React.Fragment key={follower.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar
                          src={follower.avatar ? `http://localhost:8000${follower.avatar}` : ''}
                          alt={follower.username}
                        >
                          {!follower.avatar && follower.username.substring(0, 1).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="subtitle1"
                            component="span"
                            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                            onClick={() => navigate(`/profile/${follower.username}`)}
                          >
                            {follower.username}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
                {followersCount > followersList.length && (
                  <ListItem>
                    <Button onClick={() => navigate(`/profile/${username}/followers/`)}>
                      Vezi toți urmăritorii
                    </Button>
                  </ListItem>
                )}
                {followersList.length === 0 && <Typography>Nu ai urmăritori încă.</Typography>}
              </List>
            </Box>
          </Box>
        </Grid>

        {/* Eliminăm secțiunea de postări */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Postările lui {profile.username}
          </Typography>
          <Typography>Nicio postare disponibilă.</Typography>
        </Grid>
      </Grid>
    </ContainerBox>
  );
}

export default Profile;
