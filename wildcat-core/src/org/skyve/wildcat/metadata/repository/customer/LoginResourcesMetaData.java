package org.skyve.wildcat.metadata.repository.customer;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;

import org.skyve.metadata.customer.LoginResources;
import org.skyve.wildcat.util.UtilImpl;
import org.skyve.wildcat.util.XMLUtil;

@XmlType(namespace = XMLUtil.CUSTOMER_NAMESPACE, name = "LoginResources")
public class LoginResourcesMetaData implements LoginResources {
	private String loginPageURL;
	private String loginErrorPageURL;
	private String loggedOutPageURL;
	private String smartClientJavascriptURL;

	@Override
	public String getLoginPageURL() {
		return loginPageURL;
	}
	
	@XmlAttribute(name = "loginPage")
	public void setLoginPageURL(String loginPageURL) {
		this.loginPageURL = UtilImpl.processStringValue(loginPageURL);
	}
	
	@Override
	public String getLoginErrorPageURL() {
		return loginErrorPageURL;
	}
	
	@XmlAttribute(name = "loginErrorPage")
	public void setLoginErrorPageURL(String loginErrorPageURL) {
		this.loginErrorPageURL = UtilImpl.processStringValue(loginErrorPageURL);
	}
	
	@Override
	public String getLoggedOutPageURL() {
		return loggedOutPageURL;
	}
	
	@XmlAttribute(name = "loggedOutPage")
	public void setLoggedOutPageURL(String loggedOutPageURL) {
		this.loggedOutPageURL = UtilImpl.processStringValue(loggedOutPageURL);
	}
	
	@Override
	public String getSmartClientJavascriptURL() {
		return smartClientJavascriptURL;
	}
	
	@XmlAttribute(name = "smartClientJavascript")
	public void setSmartClientjavascriptURL(String smartClientJavascriptURL) {
		this.smartClientJavascriptURL = UtilImpl.processStringValue(smartClientJavascriptURL);
	}
}
