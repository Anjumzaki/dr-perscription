const mongoose = require('mongoose');
const User = require('./dist/models/User').default;

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dr-prescription');
    console.log('Connected to MongoDB');
    
    const user = await User.findOne({ email: 'zakianjummuneer@gmail.com' });
    
    if (user) {
      console.log('User found:');
      console.log('Email:', user.email);
      console.log('Name:', user.name);
      console.log('Email Verified:', user.isEmailVerified);
      console.log('Role:', user.role);
      
      if (!user.isEmailVerified) {
        console.log('\n🔥 SOLUTION: Your email is not verified!');
        console.log('You need to verify your email before you can log in.');
        
        // Check if verification token exists
        const userWithToken = await User.findOne({ email: 'zakianjummuneer@gmail.com' })
          .select('+emailVerificationToken +emailVerificationExpires');
        
        if (userWithToken.emailVerificationToken) {
          console.log('\nVerification token exists. You can:');
          console.log('1. Check your email for verification link');
          console.log('2. Or manually verify using this token:', userWithToken.emailVerificationToken);
          console.log('3. Verification expires:', userWithToken.emailVerificationExpires);
        }
      } else {
        console.log('✅ Email is verified - login should work');
      }
    } else {
      console.log('❌ User not found with email: zakianjummuneer@gmail.com');
      console.log('You may need to register first.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkUser();