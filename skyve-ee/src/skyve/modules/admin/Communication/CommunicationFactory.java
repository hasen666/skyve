package modules.admin.Communication;

import org.skyve.util.DataBuilder;
import org.skyve.util.test.DataFactory;
import org.skyve.util.test.SkyveFactory;
import org.skyve.util.test.SkyveFixture;
import org.skyve.util.test.SkyveFixture.FixtureType;

import modules.admin.Communication.actions.CreateFiles;
import modules.admin.Communication.actions.GetResults;
import modules.admin.Communication.actions.SendNow;
import modules.admin.Communication.actions.TestSend;
import modules.admin.domain.Communication;
import modules.admin.domain.Tag;

@SkyveFactory(excludedActions = { CreateFiles.class, GetResults.class, SendNow.class, TestSend.class })
public class CommunicationFactory extends DataFactory {

	@SkyveFixture(types = FixtureType.crud)
	public static Communication crudInstance() {
		Communication bean = new DataBuilder().build(Communication.MODULE_NAME, Communication.DOCUMENT_NAME);
		bean.setSystem(Boolean.FALSE);
		bean.setTag(new DataBuilder().fixture(FixtureType.crud).build(Tag.MODULE_NAME, Tag.DOCUMENT_NAME));

		return bean;
	}

	// Ensure that system is switched off so that the communication can be deleted by the SAIL test.
	@SkyveFixture(types = FixtureType.sail)
	public Communication sail() {
		Communication result = new DataBuilder(getUser()).build(Communication.MODULE_NAME, Communication.DOCUMENT_NAME);
		result.setSystem(Boolean.FALSE);
		result.setCalendarStartTime(null);
		result.setCalendarEndTime(null);
		return result;
	}
}
