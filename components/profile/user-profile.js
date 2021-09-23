import { useEffect, useState, useContext } from 'react';
import { getSession } from 'next-auth/client';
import NotificationContext from '../../store/notification-context';
import ProfileForm from './profile-form';
import classes from './user-profile.module.css';

function UserProfile(props) {
  // NO LONGER USED - USING getServerSideProps instead to redirect if not logged in
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => {
  //   getSession().then((session) => {
  //     if (!session) {
  //       window.location.href = '/auth';
  //     } else {
  //       setIsLoading(false);
  //     }
  //   });
  // }, []);

  // if (isLoading) {
  //   return <p className={classes.profile}>Loading...</p>;
  // }

  const notificationCtx = useContext(NotificationContext);

  async function changePasswordHandler(passwordData) {
    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify(passwordData),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);

    // error occurred
    if (!response.ok) {
      console.log('RESPONSE NOT OK');
      notificationCtx.showNotification({
        title: 'Error updating password!',
        message: data.message,
        status: 'error'
      });
      return;
    }

    //success
    console.log(data);
    notificationCtx.showNotification({
      title: 'Success!',
      message: 'Successfully updated password',
      status: 'success'
    });
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm onChangePassword={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
