package org.skyve.wildcat.metadata.view;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.skyve.metadata.MetaData;
import org.skyve.wildcat.util.UtilImpl;
import org.skyve.wildcat.util.XMLUtil;

/**
 * Inserts a bit of script at the location of the tag.
 * 
 * @author mike
 */
@XmlType(namespace = XMLUtil.VIEW_NAMESPACE, propOrder = {"script", "bindings"})
@XmlRootElement(namespace = XMLUtil.VIEW_NAMESPACE)
public class Inject implements MetaData {
	private static final long serialVersionUID = -4721559398509481425L;

	private String script;
	private List<InjectBinding> bindings = new ArrayList<>();
	
	public String getScript() {
		return script;
	}

	@XmlElement(namespace = XMLUtil.VIEW_NAMESPACE, required = true)
	public void setScript(String script) {
		this.script = UtilImpl.processStringValue(script);
	}

	@XmlElement(namespace = XMLUtil.VIEW_NAMESPACE, name = "accept")
	public List<InjectBinding> getBindings() {
		return bindings;
	}
}
