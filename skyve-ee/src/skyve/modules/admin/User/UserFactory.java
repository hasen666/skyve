package modules.admin.User;

import org.skyve.util.DataBuilder;
import org.skyve.util.test.DataFactory;
import org.skyve.util.test.SkyveFactory;
import org.skyve.util.test.SkyveFixture;
import org.skyve.util.test.SkyveFixture.FixtureType;

import modules.admin.User.actions.Check;
import modules.admin.User.actions.Next;
import modules.admin.domain.Contact;
import modules.admin.domain.Group;
import modules.admin.domain.User;

@SkyveFactory(excludedActions = { Check.class, Next.class })
public class UserFactory extends DataFactory {

	@SkyveFixture(types = FixtureType.crud)
	public static User crudInstance() throws Exception {
		User user = new DataBuilder().build(User.MODULE_NAME, User.DOCUMENT_NAME);
		user.setConfirmPassword(null);
		user.setGeneratedPassword(null);
		user.setNewPassword(null);

		user.setContact(new DataBuilder().fixture(FixtureType.crud).build(Contact.MODULE_NAME, Contact.DOCUMENT_NAME));

		user.getGroups().add(new DataBuilder()
				.fixture(FixtureType.crud)
				.build(Group.MODULE_NAME, Group.DOCUMENT_NAME));

		return user;
	}
}
