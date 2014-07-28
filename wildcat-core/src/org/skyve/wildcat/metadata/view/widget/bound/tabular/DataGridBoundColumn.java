package org.skyve.wildcat.metadata.view.widget.bound.tabular;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.skyve.metadata.view.widget.bound.Bound;
import org.skyve.wildcat.metadata.view.WidgetReference;
import org.skyve.wildcat.util.UtilImpl;
import org.skyve.wildcat.util.XMLUtil;

@XmlRootElement(namespace = XMLUtil.VIEW_NAMESPACE, name = "boundColumn")
@XmlType(namespace = XMLUtil.VIEW_NAMESPACE,
			propOrder = {"binding", "editable", "inputWidget"})
public class DataGridBoundColumn extends DataGridColumn implements Bound {
	/**
	 * For Serialization
	 */
	private static final long serialVersionUID = -26924109323814766L;

	private String binding;
	private WidgetReference inputWidget;
	private Boolean editable;

	@Override
	public String getBinding() {
		return binding;
	}

	@Override
	@XmlAttribute
	public void setBinding(String binding) {
		this.binding = UtilImpl.processStringValue(binding);
	}

	public WidgetReference getInputWidget() {
		return inputWidget;
	}

	@XmlElement(namespace = XMLUtil.VIEW_NAMESPACE, name = "input")
	public void setInputWidget(WidgetReference inputWidget) {
		this.inputWidget = inputWidget;
	}

	public Boolean getEditable() {
		return editable;
	}

	@XmlAttribute
	public void setEditable(Boolean editable) {
		this.editable = editable;
	}
}
