package org.skyve.wildcat.metadata.view.reference;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.skyve.wildcat.metadata.view.widget.bound.AbstractBound;
import org.skyve.wildcat.util.UtilImpl;
import org.skyve.wildcat.util.XMLUtil;

/**
 * This reference can specify a module and document and optionally a binding to a bizId
 * and it will generate a reference to the detail view of that bean.
 * 
 * @author mike
 */
@XmlType(namespace = XMLUtil.VIEW_NAMESPACE)
@XmlRootElement(namespace = XMLUtil.VIEW_NAMESPACE)
public class EditViewReference extends AbstractBound implements Reference {
	/**
	 * For Serialization
	 */
	private static final long serialVersionUID = -5721839106097161459L;
	
	private String moduleName;
	private String documentName;
	
	public String getModuleName() {
		return moduleName;
	}

	@XmlAttribute(required = true)
	public void setModuleName(String moduleName) {
		this.moduleName = UtilImpl.processStringValue(moduleName);
	}

	public String getDocumentName() {
		return documentName;
	}

	@XmlAttribute(required = true)
	public void setDocumentName(String documentName) {
		this.documentName = UtilImpl.processStringValue(documentName);
	}
}
