package com.teampurple.iccc;

import com.teampurple.iccc.models.User;
import com.teampurple.iccc.repositories.UserRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class IcccApplicationTests {

	@Autowired
	private UserRepository userRepository;

	/**
	 * Adds a user to the test database and verifies that the email and password were stored correctly.
	 */
	@Test
	public void addUser() {
		final String EMAIL = "test@email.com";
		final String PASSWORD = "testpassword";
		User user = new User(EMAIL, new BCryptPasswordEncoder(10).encode(PASSWORD));
		userRepository.save(user);
		User retrievedUser = userRepository.findByEmail(EMAIL);
		Assert.assertEquals(retrievedUser.getEmail(), user.getEmail());
		Assert.assertTrue(new BCryptPasswordEncoder().matches(PASSWORD, retrievedUser.getPassword()));
	}

}
