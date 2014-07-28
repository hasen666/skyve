package org.skyve.wildcat.metadata.view.event;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.skyve.wildcat.util.XMLUtil;

@XmlType(namespace = XMLUtil.VIEW_NAMESPACE)
@XmlRootElement(namespace = XMLUtil.VIEW_NAMESPACE, name = "server")
public class ServerSideActionEventAction implements EventAction {
	private String actionName;
	
	public String getActionName() {
		return actionName;
	}
	
	@XmlAttribute(name = "action", required = true)
	public void setActionName(String actionName) {
		this.actionName = actionName;
	}
}
