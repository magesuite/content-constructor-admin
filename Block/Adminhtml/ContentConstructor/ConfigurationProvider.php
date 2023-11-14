<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

interface ConfigurationProvider
{
    public function getExistingComponentsConfiguration();

    public function getPageType();
}
