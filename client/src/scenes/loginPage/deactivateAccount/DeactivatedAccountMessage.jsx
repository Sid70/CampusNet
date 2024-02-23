import React from 'react';
import { Link } from 'react-router-dom';

const DeactivatedAccountMessage = ({remainingDays}) => {
  return (
    <>
      Your account has been deactivated. If you want to reactivate again, please <Link to="/reactivateAccount">click here.</Link> Otherwise your account will be deleted permanently after {remainingDays} days.
    </>
  );
};

export default DeactivatedAccountMessage;
