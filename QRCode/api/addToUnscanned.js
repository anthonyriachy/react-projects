/* eslint-disable prettier/prettier */

const addToUnscannedAPI = async (owner,qrCodeId) => {
    console.log(owner,qrCodeId);
  try {
    const response = await fetch('http://192.168.1.107:3000/addToUnscanned', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({owner,qrCodeId}), //send the qr code Id
    });
    const responeData = await response.json();
    console.log(responeData.result ? responeData.result : responeData.isValid);

  } catch (error) {
    console.log(error);
  }
};
export default addToUnscannedAPI;
