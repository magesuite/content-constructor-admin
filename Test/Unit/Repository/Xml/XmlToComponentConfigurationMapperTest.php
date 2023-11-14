<?php

namespace MageSuite\ContentConstructorAdmin\Test\Unit\Repository\Xml;

class XmlToComponentConfigurationMapperTest extends \PHPUnit\Framework\TestCase
{
    private $testXmlContents = '
        <referenceContainer name="sidebar">
            <block class="Test">
                   <arguments>
                        <argument name="identifier" xsi:type="string">some_identifier</argument>
                   </arguments>
            </block>
            <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="component_in_sidebar">
                   <arguments>
                        <argument name="type" xsi:type="string">static-cms-block</argument>
                        <argument name="data" xsi:type="array">
                            <item name="identifier" xsi:type="string">sidebar_block</item>
                        </argument>
                   </arguments>
              </block>
        </referenceContainer>
        <referenceContainer name="content">
           <referenceBlock name="page.main.title" remove="true"/>
              <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="first_random_generated_value">
                   <arguments>
                        <argument name="type" xsi:type="string">static-cms-block</argument>
                        <argument name="data" xsi:type="array">
                            <item name="identifier" xsi:type="string">cms_static_block_identifier</item>
                            <item name="classes" xsi:type="array">
                                <item name="class" xsi:type="string">undefined</item>
                            </item>
                        </argument>
                   </arguments>
              </block>
              <block class="ClientCustomClass" name="client_custom_class">
                <arguments>
                    <argument name="block_id" xsi:type="string">identifier</argument>
                </arguments>
              </block>
              <block class="MageSuite\ContentConstructorFrontend\Block\Component" name="second_random_generated_value">
                   <arguments>
                        <argument name="type" xsi:type="string">headline</argument>
                        <argument name="data" xsi:type="array">
                            <item name="title" xsi:type="string">Some Title</item>
                            <item name="subtitle" xsi:type="string">Some Subtitle</item>
                        </argument>
                   </arguments>
              </block>
           </referenceContainer>
        ';

    private $configuration;

    private $firstComponent;
    private $secondComponent;
    private $thirdComponent;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper
     */
    private $reader;

    public function setUp()
    {
        $this->reader = new \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper();

        $this->configuration = $this->reader->map($this->testXmlContents);

        $this->firstComponent = $this->configuration[0];
        $this->secondComponent = $this->configuration[1];
        $this->thirdComponent = $this->configuration[2];
    }

    public function testItReturnsCorrectNumberOfComponents()
    {
        $this->assertCount(3, $this->configuration);
    }

    public function testItReturnsCorrectComponentType()
    {
        $this->assertEquals('static-cms-block', $this->firstComponent['type']);
        $this->assertEquals('static-cms-block', $this->secondComponent['type']);
        $this->assertEquals('headline', $this->thirdComponent['type']);
    }

    public function testItReturnsCorrectComponentSections()
    {
        $this->assertEquals('sidebar', $this->firstComponent['section']);
        $this->assertEquals('content', $this->secondComponent['section']);
        $this->assertEquals('content', $this->thirdComponent['section']);
    }
    public function testItReturnsCorrectComponentId()
    {
        $this->assertEquals('component_in_sidebar', $this->firstComponent['id']);
        $this->assertEquals('first_random_generated_value', $this->secondComponent['id']);
        $this->assertEquals('second_random_generated_value', $this->thirdComponent['id']);
    }

    public function testItReturnsCorrectComponentData()
    {
        $this->assertEquals('sidebar_block', $this->firstComponent['data']['identifier']);

        $this->assertEquals('cms_static_block_identifier', $this->secondComponent['data']['identifier']);
        $this->assertEquals('undefined', $this->secondComponent['data']['classes']['class']);

        $this->assertEquals('Some Title', $this->thirdComponent['data']['title']);
        $this->assertEquals('Some Subtitle', $this->thirdComponent['data']['subtitle']);
    }
}
