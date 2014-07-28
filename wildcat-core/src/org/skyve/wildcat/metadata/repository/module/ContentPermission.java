package org.skyve.wildcat.metadata.repository.module;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlType;

import org.skyve.wildcat.util.UtilImpl;
import org.skyve.wildcat.util.XMLUtil;

/**
 * Content Permissions are specified in user roles.
 * It is assumed that most uses will want a completely open textual searching
 * mechanism so as to be most useful - but we can specify permissions instead of restrictions,
 * when the entire document is not readable.
 * 
 * If an attribute is permitted it will not be streamed from the 
 * CustomerResourceServlet.
 * 
 * @author Mike
 */
@XmlType(namespace = XMLUtil.MODULE_NAMESPACE)
public class ContentPermission {
	private String attributeName;
	private String documentName;

	public String getAttributeName() {
		return attributeName;
	}

	@XmlAttribute(name = "attribute", required = true)
	public void setAttributeName(String attributeName) {
		this.attributeName = UtilImpl.processStringValue(attributeName);
	}

	public String getDocumentName() {
		return documentName;
	}

	public void setDocumentName(String documentName) {
		this.documentName = UtilImpl.processStringValue(documentName);
	}
}
