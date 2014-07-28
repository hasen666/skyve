package org.skyve.wildcat.util;

import java.util.Set;

import org.skyve.metadata.customer.Customer;
import org.skyve.metadata.user.User;
import org.skyve.wildcat.util.json.JSONReader;
import org.skyve.wildcat.util.json.JSONWriter;

public class JSONUtil {
	/**
	 * Create JSON.
	 * 
	 * @param customer
	 * @param beanOrBeans Either a Bean or List<Bean> or a Java Bean
	 * @param propertyNames Needed for marshalling the result of executing a Query.
	 * @return The JSON.
	 */
	public static final String marshall(Customer customer, Object beanOrBeans, Set<String> propertyNames)
	throws Exception {
		JSONWriter writer = new JSONWriter(customer);
		return writer.write(beanOrBeans, propertyNames);
	}

	/**
	 * Consume JSON.
	 * 
	 * @param user
	 * @param json
	 * @return a Bean or List<Bean> or a Map or a Java bean.
	 */
	public static final Object unmarshall(User user, String json) 
	throws Exception {
		JSONReader reader = new JSONReader(user);
		return reader.read(json);
	}
}
