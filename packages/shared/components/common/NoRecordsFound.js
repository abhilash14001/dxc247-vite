import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInbox } from '@fortawesome/free-solid-svg-icons';

const NoRecordsFound = ({ colSpan = 1, message = "No records found", icon = faInbox }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-4">
        <div className="text-muted">
          <FontAwesomeIcon icon={icon} className="fa-2x mb-2" />
          <br />
          {message}
        </div>
      </td>
    </tr>
  );
};

export default NoRecordsFound;
