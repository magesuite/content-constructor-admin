<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\Widget;

class Form extends \Magento\Widget\Block\Adminhtml\Widget\Form
{
    protected function _getSkippedWidgets()
    {
        $filterWidgets = $this->getRequest()->getParam('filter_widgets');
        if($filterWidgets){
            $allWidgets = $this->_widgetFactory->create()->getWidgetsArray();

            $skippedWidgets = [];
            foreach($allWidgets AS $widget){
                if(strpos($widget['type'], $filterWidgets) === false){
                    $skippedWidgets[] = $widget['type'];
                }
            }

            if(count($skippedWidgets) > 0){
                return $skippedWidgets;
            }
        }

        return $this->_coreRegistry->registry('skip_widgets');
    }


}
