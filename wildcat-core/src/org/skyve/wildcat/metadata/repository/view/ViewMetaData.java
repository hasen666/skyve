package org.skyve.wildcat.metadata.repository.view;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlElementRef;
import javax.xml.bind.annotation.XmlElementRefs;
import javax.xml.bind.annotation.XmlElementWrapper;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;

import org.skyve.metadata.MetaDataException;
import org.skyve.metadata.controller.ImplicitActionName;
import org.skyve.metadata.view.Parameterizable;
import org.skyve.metadata.view.View;
import org.skyve.metadata.view.View.ViewType;
import org.skyve.metadata.view.widget.bound.Parameter;
import org.skyve.wildcat.metadata.Container;
import org.skyve.wildcat.metadata.repository.PersistentMetaData;
import org.skyve.wildcat.metadata.repository.view.actions.Action;
import org.skyve.wildcat.metadata.repository.view.actions.AddAction;
import org.skyve.wildcat.metadata.repository.view.actions.BizExportAction;
import org.skyve.wildcat.metadata.repository.view.actions.BizImportAction;
import org.skyve.wildcat.metadata.repository.view.actions.CancelAction;
import org.skyve.wildcat.metadata.repository.view.actions.CustomAction;
import org.skyve.wildcat.metadata.repository.view.actions.DefaultsAction;
import org.skyve.wildcat.metadata.repository.view.actions.DeleteAction;
import org.skyve.wildcat.metadata.repository.view.actions.NewAction;
import org.skyve.wildcat.metadata.repository.view.actions.OKAction;
import org.skyve.wildcat.metadata.repository.view.actions.RemoveAction;
import org.skyve.wildcat.metadata.repository.view.actions.ReportAction;
import org.skyve.wildcat.metadata.repository.view.actions.SaveAction;
import org.skyve.wildcat.metadata.repository.view.actions.UploadAction;
import org.skyve.wildcat.metadata.repository.view.actions.ZoomOutAction;
import org.skyve.wildcat.metadata.view.ViewImpl;
import org.skyve.wildcat.util.UtilImpl;
import org.skyve.wildcat.util.XMLUtil;

@XmlRootElement(namespace = XMLUtil.VIEW_NAMESPACE, name = "view")
@XmlType(namespace = XMLUtil.VIEW_NAMESPACE, 
			name = "view",
			propOrder = {"documentation",
							"actions", 
							"type", 
							"title", 
							"refreshTimeInSeconds",
							"refreshConditionName", 
							"refreshActionName",
							"parameters"})
public class ViewMetaData extends Container implements PersistentMetaData<View>, Parameterizable {
	/**
	 * For Serialization
	 */
	private static final long serialVersionUID = -1831750070396044584L;

	private ViewType type;
	private String title;
	private List<Action> actions = new ArrayList<>();
	private Integer refreshTimeInSeconds;
	private String refreshConditionName;
	private String refreshActionName;
	private List<Parameter> parameters = new ArrayList<>();
	private String documentation;
	
	public ViewType getType() {
		return type;
	}

	@XmlAttribute(required = true)
	public void setType(ViewType type) {
		this.type = type;
	}

	public String getTitle() {
		return title;
	}

	@XmlAttribute(required = true)
	public void setTitle(String title) {
		this.title = UtilImpl.processStringValue(title);
	}

	@XmlElementWrapper(namespace = XMLUtil.VIEW_NAMESPACE, name = "actions")
	@XmlElementRefs({@XmlElementRef(type = AddAction.class),
						@XmlElementRef(type = BizExportAction.class),
						@XmlElementRef(type = BizImportAction.class),
						@XmlElementRef(type = CancelAction.class),
						@XmlElementRef(type = CustomAction.class),
						@XmlElementRef(type = DefaultsAction.class),
						@XmlElementRef(type = DeleteAction.class),
						@XmlElementRef(type = NewAction.class),
						@XmlElementRef(type = OKAction.class),
						@XmlElementRef(type = RemoveAction.class),
						@XmlElementRef(type = ReportAction.class),
						@XmlElementRef(type = SaveAction.class),
						@XmlElementRef(type = UploadAction.class),
						@XmlElementRef(type = ZoomOutAction.class)})
	public List<Action> getActions() {
		return actions;
	}

	public Integer getRefreshTimeInSeconds() {
		return refreshTimeInSeconds;
	}

	@XmlAttribute(name = "refreshTimeInSeconds", required = false)
	public void setRefreshTimeInSeconds(Integer refreshTimeInSeconds) {
		this.refreshTimeInSeconds = refreshTimeInSeconds;
	}

	public String getRefreshConditionName() {
		return refreshConditionName;
	}

	@XmlAttribute(name = "refreshIf", required = false)
	public void setRefreshConditionName(String refreshConditionName) {
		this.refreshConditionName = UtilImpl.processStringValue(refreshConditionName);
	}

	public String getRefreshActionName() {
		return refreshActionName;
	}

	@XmlAttribute(name = "refreshAction", required = false)
	public void setRefreshActionName(String refreshActionName) {
		this.refreshActionName = UtilImpl.processStringValue(refreshActionName);
	}

	/**
	 * These represent parameters that are allowed to be populated when creating a new record.
	 */
	@Override
	@XmlElementWrapper(namespace = XMLUtil.VIEW_NAMESPACE, name = "newParameters")
	@XmlElement(namespace = XMLUtil.VIEW_NAMESPACE,
					name = "parameter",
					type = org.skyve.wildcat.metadata.view.widget.bound.Parameter.class,
					required = false)
	public List<Parameter> getParameters() {
		return parameters;
	}
	
	public String getDocumentation() {
		return documentation;
	}
	
	@XmlElement(namespace = XMLUtil.VIEW_NAMESPACE)
	public void setDocumentation(String documentation) {
		this.documentation = documentation;
	}

	@Override
	public org.skyve.metadata.view.View convert(String metaDataName) throws MetaDataException {
		ViewImpl result = new ViewImpl();
		String value = getTitle();
		if (value == null) {
			throw new MetaDataException(metaDataName + " : The view [title] is required for view " + metaDataName);
		}
		result.setTitle(value);

		ViewType theType = getType();
		if (theType == null) {
			throw new MetaDataException(metaDataName + " : The view [type] is required for view " + metaDataName);
		}
		result.setType(theType);

		result.getContained().addAll(getContained());

		if (actions != null) {
			for (Action actionMetaData : actions) {
				org.skyve.metadata.view.Action action = actionMetaData.toMetaDataAction();
				ImplicitActionName implicitName = action.getImplicitName();
				if (action.getResourceName() == null) {
					if (implicitName == null) { // custom action
						throw new MetaDataException(metaDataName + " : [className] is required for a custom action for " + 
														getType() + " view " + metaDataName);
					}
					else if (ImplicitActionName.BizExport.equals(implicitName) || 
								ImplicitActionName.BizImport.equals(implicitName)) {
						throw new MetaDataException(metaDataName + " : [className] is required for a BizPort action for " +
														getType() + " view " + metaDataName);
					}
					else if (ImplicitActionName.Report.equals(implicitName)) {
						throw new MetaDataException(metaDataName + " : [reportName] is required for a report action for " + 
														getType() + " view " + metaDataName);
					}
				}
				else {
					value = actionMetaData.getDisplayName();
					if (value == null) {
						throw new MetaDataException(metaDataName + " : The view action [displayName] is required for the designer defined action " +
														action.getResourceName() + " for " + getType() + " view " + metaDataName);
					}
				}

				if (result.getAction(action.getName()) != null) {
					throw new MetaDataException(metaDataName + " : The view action named " + action.getName() + " is defined in the " +
													getType() + " view multiple times");
				}
				result.putAction(action);
			}
		}

		result.setRefreshTimeInSeconds(getRefreshTimeInSeconds());
		value = getRefreshConditionName();
		if (value != null) {
			if (result.getRefreshTimeInSeconds() == null) {
				throw new MetaDataException(metaDataName + " : The view [refreshIf] is defined but no [refreshTimeInSeconds] is defined in " + getType() + " view " + metaDataName);
			}
			result.setRefreshConditionName(value);
		}
		value = getRefreshActionName();
		if (value != null) {
			if (result.getRefreshTimeInSeconds() == null) {
				throw new MetaDataException(metaDataName + " : The view [refreshAction] is defined but no [refreshTimeInSeconds] is defined in " + getType() + " view " + metaDataName);
			}
			if (result.getAction(value) == null) {
				throw new MetaDataException(metaDataName + " : The view [refreshAction] is not a valid action in " + getType() + " view " + metaDataName);
			}
			result.setRefreshActionName(value);
		}

		if ((parameters != null) && (! parameters.isEmpty())) {
			for (Parameter parameter : parameters) {
				if (parameter.getName() == null) {
					throw new MetaDataException(metaDataName + " : The " + getType() + " view newParameter [name] is required in " + getType() + " view " + metaDataName);
				}
				if ((parameter.getBinding() != null) || (parameter.getValue() != null)) {
					throw new MetaDataException(metaDataName + " : The " + getType() + " view " + parameter.getName() + " newParameter [binding] or [value] are not required in view " + getType() + " view " + metaDataName);
				}
			}
			result.getParameters().addAll(parameters);
		}

		result.setDocumentation(documentation);
		
		return result;
	}
}
