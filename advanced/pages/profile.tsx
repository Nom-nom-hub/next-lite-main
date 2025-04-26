import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Input from '../../components/Input';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
  const { theme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }, [isAuthenticated]);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    bio: ''
  });
  
  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    emailNotifications: true,
    darkMode: false,
    language: 'en'
  });
  
  // Initialize forms when user data is available
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || ''
      });
      
      // In a real app, you would fetch user settings from an API
      setSettingsForm({
        emailNotifications: true,
        darkMode: theme.name === 'dark',
        language: 'en'
      });
    }
  }, [user, theme.name]);
  
  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle settings form changes
  const handleSettingsChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettingsForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle profile form submit
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the form data to an API
    alert('Profile updated successfully!');
  };
  
  // Handle settings form submit
  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the form data to an API
    alert('Settings updated successfully!');
  };
  
  if (!isAuthenticated || !user) {
    return (
      <Layout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh'
        }}>
          <div style={{
            display: 'inline-block',
            width: '50px',
            height: '50px',
            border: `3px solid ${theme.border}`,
            borderRadius: '50%',
            borderTopColor: theme.primary,
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div style={{
        maxWidth: '1000px',
        margin: '2rem auto',
        padding: '0 1.5rem'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: ['column', 'row'],
          gap: '2rem'
        }}>
          {/* Sidebar */}
          <div style={{
            width: ['100%', '250px'],
            flexShrink: 0
          }}>
            <Card>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                marginBottom: '1.5rem'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <img 
                    src={user.avatar || 'https://via.placeholder.com/100'} 
                    alt={user.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                
                <h2 style={{
                  fontSize: '1.25rem',
                  marginBottom: '0.25rem',
                  color: theme.text
                }}>
                  {user.name}
                </h2>
                
                <p style={{
                  fontSize: '0.875rem',
                  color: theme.text + '99',
                  marginBottom: '0.5rem'
                }}>
                  @{user.username}
                </p>
                
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: theme.primary + '11',
                  color: theme.primary,
                  borderRadius: '999px',
                  fontSize: '0.75rem'
                }}>
                  {user.role}
                </span>
              </div>
              
              <nav>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: activeTab === 'profile' ? theme.primary + '11' : 'transparent',
                        color: activeTab === 'profile' ? theme.primary : theme.text,
                        border: 'none',
                        borderRadius: '4px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <span style={{ marginRight: '0.5rem' }}>👤</span>
                      Profile
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: activeTab === 'settings' ? theme.primary + '11' : 'transparent',
                        color: activeTab === 'settings' ? theme.primary : theme.text,
                        border: 'none',
                        borderRadius: '4px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <span style={{ marginRight: '0.5rem' }}>⚙️</span>
                      Settings
                    </button>
                  </li>
                  <li>
                    <button 
                      onClick={() => setActiveTab('security')}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: activeTab === 'security' ? theme.primary + '11' : 'transparent',
                        color: activeTab === 'security' ? theme.primary : theme.text,
                        border: 'none',
                        borderRadius: '4px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <span style={{ marginRight: '0.5rem' }}>🔒</span>
                      Security
                    </button>
                  </li>
                </ul>
              </nav>
              
              <div style={{
                marginTop: '2rem',
                borderTop: `1px solid ${theme.border}`,
                paddingTop: '1.5rem'
              }}>
                <Button 
                  variant="outline"
                  fullWidth
                  onClick={logout}
                >
                  Log Out
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Main Content */}
          <div style={{
            flex: 1
          }}>
            <Card>
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    color: theme.text
                  }}>
                    Profile Information
                  </h2>
                  
                  <form onSubmit={handleProfileSubmit}>
                    <Input
                      label="Full Name"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      fullWidth
                      containerStyle={{ marginBottom: '1.5rem' }}
                    />
                    
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      fullWidth
                      containerStyle={{ marginBottom: '1.5rem' }}
                    />
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                        color: theme.text
                      }}>
                        Bio
                      </label>
                      <textarea
                        name="bio"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                        rows={4}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.background,
                          color: theme.text,
                          fontSize: '1rem',
                          resize: 'vertical'
                        }}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    
                    <Button 
                      type="submit"
                      variant="primary"
                    >
                      Save Changes
                    </Button>
                  </form>
                </div>
              )}
              
              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    color: theme.text
                  }}>
                    Account Settings
                  </h2>
                  
                  <form onSubmit={handleSettingsSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={settingsForm.emailNotifications}
                          onChange={handleSettingsChange}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span style={{ color: theme.text }}>
                          Receive email notifications
                        </span>
                      </label>
                    </div>
                    
                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                      }}>
                        <input
                          type="checkbox"
                          name="darkMode"
                          checked={settingsForm.darkMode}
                          onChange={handleSettingsChange}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <span style={{ color: theme.text }}>
                          Use dark mode
                        </span>
                      </label>
                    </div>
                    
                    <div style={{ marginBottom: '2rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        fontWeight: 500,
                        color: theme.text
                      }}>
                        Language
                      </label>
                      <select
                        name="language"
                        value={settingsForm.language}
                        onChange={handleSettingsChange}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          border: `1px solid ${theme.border}`,
                          backgroundColor: theme.background,
                          color: theme.text,
                          fontSize: '1rem'
                        }}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                      </select>
                    </div>
                    
                    <Button 
                      type="submit"
                      variant="primary"
                    >
                      Save Settings
                    </Button>
                  </form>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === 'security' && (
                <div>
                  <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: '1.5rem',
                    color: theme.text
                  }}>
                    Security Settings
                  </h2>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      marginBottom: '1rem',
                      color: theme.text
                    }}>
                      Change Password
                    </h3>
                    
                    <form>
                      <Input
                        label="Current Password"
                        type="password"
                        fullWidth
                        containerStyle={{ marginBottom: '1.5rem' }}
                      />
                      
                      <Input
                        label="New Password"
                        type="password"
                        fullWidth
                        containerStyle={{ marginBottom: '1.5rem' }}
                      />
                      
                      <Input
                        label="Confirm New Password"
                        type="password"
                        fullWidth
                        containerStyle={{ marginBottom: '1.5rem' }}
                      />
                      
                      <Button 
                        type="submit"
                        variant="primary"
                      >
                        Update Password
                      </Button>
                    </form>
                  </div>
                  
                  <div style={{
                    marginTop: '3rem',
                    borderTop: `1px solid ${theme.border}`,
                    paddingTop: '1.5rem'
                  }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      marginBottom: '1rem',
                      color: theme.error
                    }}>
                      Danger Zone
                    </h3>
                    
                    <p style={{
                      marginBottom: '1.5rem',
                      color: theme.text + 'cc'
                    }}>
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    
                    <Button 
                      variant="danger"
                      onClick={() => confirm('Are you sure you want to delete your account? This action cannot be undone.')}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
