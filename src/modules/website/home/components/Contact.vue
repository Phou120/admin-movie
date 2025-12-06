<template>
  <a-layout>
    <AppHeader />
    <div class="contact-page">
      <h1 class="page-title">Contact Us</h1>
      <div class="contact-container">
        <!-- Contact Details -->
        <div class="contact-info">
          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have a question, feedback,
            or just want to say hello, feel free to reach out.
          </p>
          <ul>
            <li><strong>Address:</strong> 123 Main Street, City, Country</li>
            <li><strong>Phone:</strong> +1 234 567 890</li>
            <li><strong>Email:</strong> contact@savamovie.com</li>
          </ul>
          <div class="social-icons">
            <a href="#" target="_blank" aria-label="LinkedIn">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="#" target="_blank" aria-label="Twitter">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" target="_blank" aria-label="Email">
              <i class="fas fa-envelope"></i>
            </a>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form">
          <h2>Send a Message</h2>
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Your Name</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Your Name"
                required
              />
            </div>
            <div class="form-group">
              <label for="email">Your Email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Your Email"
                required
              />
            </div>
            <div class="form-group">
              <label for="tel">Your Tel</label>
              <input
                id="tel"
                v-model="form.tel"
                type="text"
                placeholder="Your Tel"
                required
              />
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                placeholder="Your Message"
                required
              ></textarea>
            </div>
            <button type="submit" class="submit-button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
    <a-layout-footer
      style="text-align: center; padding: 24px 50px; background: #f0efefff"
    >
      <div class="footer-content">
        <p class="footer-text">
          SAVA MOVIE &copy; {{ new Date().getFullYear() }} | All rights
          reserved.
        </p>
      </div>
    </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref } from "vue";
import AppHeader from "./AppHeader.vue";

const form = ref({
  name: "",
  email: "",
  tel: "",
  message: "",
});

const submitForm = () => {
  // You can add your form submission logic here
  alert(`Thank you, ${form.value.name}! Your message has been sent.`);
  // Reset form
  form.value.name = "";
  form.value.email = "";
  form.value.tel = "";
  form.value.message = "";
};
</script>

<style lang="scss" scoped>
.contact-page {
  padding: 30px 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #f5f5f5;

  .page-title {
    text-align: center;
    font-size: 3rem;
    margin-bottom: 40px;
    color: #0d334aff;
  }

  .contact-container {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    justify-content: center;

    @media (max-width: 768px) {
      flex-direction: column;
    }

    .contact-info,
    .contact-form {
      flex: 1 1 45%;
      min-width: 300px;

      h2 {
        color: #0d334aff;
        margin-bottom: 20px;
        font-size: 2rem;
      }

      p {
        margin-bottom: 20px;
        line-height: 1.6;
        color: #555;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 10px;
          font-size: 1rem;
          color: #333;

          strong {
            color: #0d334aff;
          }
        }
      }

      .social-icons {
        margin-top: 20px;
        display: flex;
        gap: 20px;

        a {
          font-size: 1.5rem;
          color: #0d334aff;
          transition: color 0.3s;

          &:hover {
            color: #1a5380;
          }
        }
      }

      form {
        display: flex;
        flex-direction: column;

        .form-group {
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;

          label {
            margin-bottom: 5px;
            font-weight: 600;
            color: #333;
          }

          input,
          textarea {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1rem;
            transition: border-color 0.3s;

            &:focus {
              border-color: #0d334aff;
              outline: none;
            }
          }
        }

        .submit-button {
          padding: 12px 24px;
          background-color: #0d334aff;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: background-color 0.3s, transform 0.2s;

          &:hover {
            background-color: #1a5380;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}
</style>
