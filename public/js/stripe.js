// const stripe = new stripe(
//   'pk_test_51QcOvRRxa5iP2FI39OyeYuHBwsBkAB2v4YyCOOAcU87JlRoqNjuHOyMilZ8BaUj1wWzYal1sQn1gXksMEAGR5kMr003bz2NnXK'
// );

// const bookTour = async tourId => {
//   try {
//     // 1) Get checkout session from API
//     const session = await axios(
//       `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
//     );
//     console.log(session);
//     // 2) Create checkout form + charge credit card
//     // await stripe.redirectToCheckout({
//     //   sessionId: session.data.session.id
//     // });
//   } catch (err) {
//     console.log(err);
//     showAlert('error', err);
//   }
// };

// const bookBtn = document.getElementById('book-tour');
// if (bookBtn) {
//   console.log(
//     '--------------------------------------------------------------------'
//   );
//   console.log('bookBtn');
//   bookBtn.addEventListener('click', e => {
//     e.target.textContent = 'Processing...';
//     //const tourId = e.target.dataset.tourId;
//     const { tourId } = e.target.dataset;
//     bookTour(tourId);
//   });
// }
