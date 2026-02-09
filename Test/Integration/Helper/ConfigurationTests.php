<?php

declare(strict_types=1);

namespace Magesuite\ContentConstructorAdmin\Helper;

class ConfigurationTests extends \PHPUnit\Framework\TestCase
{
    protected ?\MageSuite\ContentConstructorAdmin\Helper\Configuration $configuration;

    public function setUp(): void
    {
        $objectManager = \Magento\Framework\App\ObjectManager::getInstance();
        $this->configuration = $objectManager->get(\MageSuite\ContentConstructorAdmin\Helper\Configuration::class);
    }

    /**
     * @magentoConfigFixture default/admin/url/custom_path testadmin
     */
    public function testItReturnsCorrectAdminPrefixFromDatabase()
    {
        $adminPath = $this->configuration->getAdminPath();
        $this->assertEquals('testadmin', $adminPath);
    }

    public function testItReturnsCorrectAdminPrefixFromAppEnv()
    {
        $adminPath = $this->configuration->getAdminPath();
        $this->assertEquals('backend', $adminPath);
    }
}
