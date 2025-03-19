/* eslint-disable */
const submitReview = async (tourId, rating, review) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        rating,
        review
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully!');
      window.setTimeout(() => {
        location.reload();
      }, 2000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

// DOM ELEMENTS
const reviewBtn = document.querySelector('.write-review');

if (reviewBtn)
  console.log('reviewBtn');
  reviewBtn.addEventListener('click', e => {
    e.preventDefault();
    const tourId = e.target.dataset.tourId;
    
    // Create modal for review input
    const modal = document.createElement('div');
    modal.className = 'review-modal';
    modal.innerHTML = `
      <div class="review-modal__content">
        <h2 class="heading-secondary">Write Your Review</h2>
        <form class="review-form">
          <div class="form__group">
            <label class="form__label" for="rating">Rating</label>
            <select class="form__input" id="rating" required>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>
          <div class="form__group">
            <label class="form__label" for="review">Review</label>
            <textarea class="form__input" id="review" required></textarea>
          </div>
          <div class="form__group">
            <button class="btn btn--green" type="submit">Submit Review</button>
            <button class="btn btn--grey" type="button" id="cancel-review">Cancel</button>
          </div>
        </form>
      </div>
    `;
    
    document.querySelector('.cta__content_review_body').appendChild(modal);

    //document.body.appendChild(modal);
    
    // Handle form submission
    const form = modal.querySelector('.review-form');
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const rating = document.getElementById('rating').value;
      const review = document.getElementById('review').value;
      await submitReview(tourId, rating, review);
      modal.remove();
    });
    
    // Handle cancel button
    const cancelBtn = document.getElementById('cancel-review');
    cancelBtn.addEventListener('click', () => {
      modal.remove();
    });
  });
