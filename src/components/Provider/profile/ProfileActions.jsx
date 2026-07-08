import React from 'react';

const ProfileActions = () => {
  const containerStyle = {
    display: 'flex',
    gap: '15px',
    marginTop: '10px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '25px'
  };

  const saveBtnStyle = {
    backgroundColor: '#f59e0b',
    color: '#ffffff',
    border: 'none',
    padding: '12px 30px',
    borderRadius: '8px',
    cursor: pointer,
    fontSize: '14px',
    fontWeight: 'bold'
  };
  const cancelBtnStyle = {
    backgroundColor: '#ffffff',
    color: '#1e3a8a',
    border: '1px solid #1e3a8a',
    padding: '12px 30px',
    borderRadius: '8px',
    cursor: pointer,
    fontSize: '14px',
    fontWeight: 'bold'
  };

  return (
    <div style={containerStyle}>
      <button style={saveBtnStyle}>حفظ التغييرات</button>
      <button style={cancelBtnStyle}>إلغاء التغييرات</button>
    </div>
  );
};

export default ProfileActions;
