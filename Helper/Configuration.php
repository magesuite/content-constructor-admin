<?php

namespace MageSuite\ContentConstructorAdmin\Helper;

class Configuration
{
    const SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH = 'magesuite/content_constructor_admin/preview_secret';

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfig;

    public function __construct(\Magento\Framework\App\Config\ScopeConfigInterface $scopeInterface)
    {
        $this->scopeConfig = $scopeInterface;
    }

    public function getSecretPreviewToken()
    {
        return $this->scopeConfig->getValue(self::SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH);
    }
}
