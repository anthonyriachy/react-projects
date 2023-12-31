/* eslint-disable prettier/prettier */

const validateQRCodeAPI = async (data,user) => {
  try {
    const response = await fetch(
      'http://192.168.1.107:3000/validate-qrCode',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({data,user}),
      },
    );

    if (!response.ok) {
      throw new Error('Failed to validate QR code');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error validating QR code:', error);
    throw error;
  }
};

export default validateQRCodeAPI;
